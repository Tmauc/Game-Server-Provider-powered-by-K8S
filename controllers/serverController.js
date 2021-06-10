const db = require('../dbConnect')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const fs = require('fs');
const replace = require('replace-in-file');

exports.postNamespace = async function (req, res) {
    const user_id = req.jwt.id;
    if (!req.body.namespace_name || !user_id) {
        return res.status(400).send({
            message: "Bad arguments 'namespace_name' or user_id is undefined",
        });
    }
    const { namespace_name } = req.body;

    try {
        await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml create namespace ' + namespace_name);

        db.query("UPDATE users SET userNamespace = ? WHERE id = ?", [namespace_name, user_id], (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred userNamespace: ${error}`,
                });
            }
            return res.status(200).send({
                message: "Namespace successfully added",
            });
        })
    }
    catch (error) {
        return res.status(400).send({
            message: `An error has occurred ici: ${error}`,
        });
    }
}

exports.deleteNamespace = async function (req, res) {
    const user_id = req.jwt.id;
    if (!req.body.namespace_name || !user_id) {
        return res.status(400).send({
            message: "Bad arguments 'namespace_name' or user_id is undefined",
        });
    }
    const { namespace_name } = req.body;

    try {
        await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml delete namespaces ' + namespace_name);
        db.query("UPDATE users SET userNamespace = ? WHERE id = ?", [null, user_id], (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`,
                });
            }
            return res.status(200).send({
                message: "Namespace successfully delete",
            });
        })
    }
    catch (error) {
        return res.status(400).send({
            message: `An error has occurred: ${error}`,
        });
    }
}

async function namespaceServices(namespace_name) {
    try {
        let services = [];
        let servicesString = await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml get service -n=' + namespace_name);
        servicesString = servicesString.stdout;
        servicesString = servicesString.substring(servicesString.indexOf('\n') + 1)

        for (let i = 0; servicesString.length > 0; i++) {
            servicesString = servicesString.substring(servicesString.indexOf("   ") + 3)
            servicesString = servicesString.substring(servicesString.indexOf("   ") + 3)
            servicesString = servicesString.substring(servicesString.indexOf("   ") + 3)
            services[i] = servicesString.substring(0, servicesString.indexOf(' '))
            servicesString = servicesString.substring(servicesString.indexOf("   ") + 3)
            services[i] = services[i] + ":" + servicesString.substring(0, servicesString.indexOf(':'))
            servicesString = servicesString.substring(servicesString.indexOf('\n') + 1)
        }

        return services;
    }
    catch (error) {
        console.log(`An error has occurred: ${error}`)
        return false;
    }
}

async function namespaceDeployments(namespace_name) {
    try {
        let deployments = [];
        let deploymentsString = await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml get deployment -n=' + namespace_name);
        deploymentsString = deploymentsString.stdout;
        deploymentsString = deploymentsString.substring(deploymentsString.indexOf('\n') + 1)

        for (let i = 0; deploymentsString.length > 0; i++) {
            deployments[i] = deploymentsString.substring(0, deploymentsString.indexOf(' '))
            deploymentsString = deploymentsString.substring(deploymentsString.indexOf('\n') + 1)
        }
        return deployments;
    }
    catch (error) {
        console.log(`An error has occurred: ${error}`)
        return false;
    }
}

exports.getNamespaceDeploymentsServices = async function (req, res) {
    if (!req.body.namespace_name) {
        return res.status(400).send({
            message: "Bad arguments 'namespace_name'",
        });
    }
    const { namespace_name } = req.body;
    const deployments = await namespaceDeployments(namespace_name);
    const services = await namespaceServices(namespace_name);
    if (deployments !== false || services !== false)
        return res.status(200).send({
            deployments: deployments,
            services: services,
            size: deployments.length,
        });
    else
        return res.status(400).send({
            message: "Something went wrong when getting namespace deployments/services"
        });
}

exports.postServer = async function (req, res) {
    const user_id = req.jwt.id;
    if (!req.body.game_name || !user_id) {
        return res.status(400).send({
            message: "Bad arguments 'game_name' or user_id is undefined",
        });
    }
    const { game_name } = req.body;

    try {
        db.query('SELECT * from users WHERE id = ?', [user_id], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`
                });
            }
            if (result.length < 0) {
                return res.status(400).send({
                    message: "The user does not exist",
                });
            }

            const string = JSON.stringify(result[0]);
            const json = JSON.parse(string);
            const namespace_name = json.userNamespace;
            const deployments = await namespaceDeployments(namespace_name);
            if (deployments === false) {
                return res.status(400).send({
                    message: "Something went wrong when getting namespace deployments"
                });
            }
            let index = 1;
            if (deployments.length > 0)
                index = Number(deployments[deployments.length - 1].substring(deployments[deployments.length - 1].indexOf('deployment-') + 11)) + 1;

            fs.copyFileSync("DefaultServer/defaultPv-claim.yaml", "./Server/pv-claim.yaml")
            fs.copyFileSync("DefaultServer/defaultDeployment.yaml", "./Server/deployment.yaml")
            fs.copyFileSync("DefaultServer/defaultService.yaml", "./Server/service.yaml")

            const renamePvClaim = {
                files: './Server/pv-claim.yaml',
                from: /server-pvc-name/gi,
                to: `${game_name}-deployment-pvc-` + index,
            };
            await replace(renamePvClaim)
            const renameDeploymentPvClaim = {
                files: './Server/deployment.yaml',
                from: /server-pvc-name/gi,
                to: `${game_name}-deployment-pvc-` + index,
            };
            await replace(renameDeploymentPvClaim)
            const renameDeployment = {
                files: './Server/deployment.yaml',
                from: /deployment-name/gi,
                to: `${game_name}-deployment-` + index,
            };
            await replace(renameDeployment)
            const renameNamespace = {
                files: './Server/deployment.yaml',
                from: /namespace-server-image-name/gi,
                to: `rg.fr-par.scw.cloud/${game_name}-serveur-1/minecraft-serveur:latest`
            };
            await replace(renameNamespace)
            const renameServiceDeployment = {
                files: './Server/service.yaml',
                from: /deployment-name/gi,
                to: `${game_name}-deployment-` + index,
            };
            await replace(renameServiceDeployment)
            const renameService = {
                files: './Server/service.yaml',
                from: /service-name/gi,
                to: `${game_name}-deployment-` + index + '-service',
            };
            await replace(renameService)

            await exec('cd Server && ' + 'kubectl --kubeconfig .kube/config.yaml apply -f pv-claim.yaml -n=' + namespace_name)
            await exec('cd Server && '
                + 'kubectl --kubeconfig .kube/config.yaml apply -f deployment.yaml -n=' + namespace_name + ' && '
                + 'kubectl --kubeconfig .kube/config.yaml apply -f service.yaml -n=' + namespace_name);

            fs.unlinkSync("./Server/pv-claim.yaml")
            fs.unlinkSync("./Server/deployment.yaml")
            fs.unlinkSync("./Server/service.yaml")

            return res.status(200).send({
                message: `${game_name} server successfully added`,
            });

        })
    }
    catch (error) {
        return res.status(400).send({
            message: `An error has occurred: ${error}`,
        });
    }
}

exports.deleteServer = async function (req, res) {
    const user_id = req.jwt.id;
    if (!req.body.deployment_name || !user_id) {
        return res.status(400).send({
            message: "Bad arguments 'deployment_name' or user_id is undefined",
        });
    }
    const { deployment_name } = req.body;

    try {
        db.query('SELECT * from users WHERE id = ?', [user_id], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`
                });
            }
            if (result.length < 0) {
                return res.status(400).send({
                    message: "The user does not exist",
                });
            }

            const string = JSON.stringify(result[0]);
            const json = JSON.parse(string);
            const namespace_name = json.userNamespace;

            await exec('cd Server && '
                + 'kubectl --kubeconfig .kube/config.yaml delete deployment ' + deployment_name + ' -n=' + namespace_name + ' && '
                + 'kubectl --kubeconfig .kube/config.yaml delete svc ' + deployment_name + '-service -n=' + namespace_name);
            return res.status(200).send({
                message: "Server successfully deleted",
            });
        })
    }
    catch (error) {
        return res.status(400).send({
            message: `An error has occurred: ${error}`,
        });
    }
}

exports.getServerLogs = async function (req, res) {
    const user_id = req.jwt.id;
    if (!req.body.deployment_name || !user_id) {
        return res.status(400).send({
            message: "Bad arguments 'deployment_name' or user_id is undefined",
        });
    }
    const { deployment_name } = req.body;

    try {
        db.query('SELECT * from users WHERE id = ?', [user_id], async (error, result) => {
            if (error) {
                return res.status(400).send({
                    message: `An error has occurred: ${error}`
                });
            }
            if (result.length < 0) {
                return res.status(400).send({
                    message: "The user does not exist",
                });
            }

            const string = JSON.stringify(result[0]);
            const json = JSON.parse(string);
            const namespace_name = json.userNamespace;

            let podString = await exec('cd Server && '
                + 'kubectl --kubeconfig .kube/config.yaml get pods --selector=app=' + deployment_name + ' -n=' + namespace_name);
            podString = podString.stdout;
            podString = podString.substring(podString.indexOf('\n') + 1)
            let pod_name = podString.substring(0, podString.indexOf(' '))
        
            let logsString = await exec('cd Server && '
                + 'kubectl --kubeconfig .kube/config.yaml logs ' + pod_name + ' game-server-container -n=' + namespace_name);
            let logs = [];
            logsString = logsString.stdout;
            for (let i = 0; logsString.length > 0; i++) {
                logs[i] = logsString.substring(0, logsString.indexOf('\n'))
                logsString = logsString.substring(logsString.indexOf('\n') + 1)
            }
            return res.status(200).send({
                logs: logs
            });
        })
    }
    catch (error) {
        return res.status(400).send({
            message: `An error has occurred: ${error}`,
        });
    }
}
