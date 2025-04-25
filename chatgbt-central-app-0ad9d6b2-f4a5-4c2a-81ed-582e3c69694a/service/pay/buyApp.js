
const https = require('https');
const util = require('../../utils/util');

async function buyApp(projectName, projectType, store_id) {
    try {
        // Validate input parameters
        if (!projectName) return util.buildResponse(401, 'No App name');
        if (!projectType) return util.buildResponse(402, 'No App type');
        if (!store_id) return util.buildResponse(403, 'No Store Data');

        // GitHub API token (ensure this is stored securely, e.g., in environment variables)
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) return util.buildResponse(500, 'GitHub token not configured');

        const templateOwner = 'dhuntleypro';
        const templateRepo = 'expo-app-template';

        try {
            // Create the repository
            const response = await createRepository(templateOwner, templateRepo, projectName, githubToken);
            if (response.statusCode !== 201) {
                return util.buildResponse(response.statusCode, `Repository creation failed: ${response.data.message || response.data}`);
            }

            const repo = response.data.name; // The name of the new repository
            if (!repo) return util.buildResponse(500, 'Repository creation failed, repo name is missing.');

            // Wait before attempting to fetch and modify files
            console.log('Waiting for GitHub to initialize the repository...');
            await delay(15000); // 15 seconds delay

            // Modify app.json
            console.log('Attempting to fetch and modify app.json...');
            const appJsonResponse = await getFileContent(templateOwner, repo, 'app.json', githubToken);
            let appJsonContent = Buffer.from(appJsonResponse.content, 'base64').toString('utf8');
            await modifyAppJson(templateOwner, repo, projectName, appJsonContent, appJsonResponse.sha, githubToken);

            // Modify package.json
            console.log('Attempting to fetch and modify package.json...');
            const packageJsonResponse = await getFileContent(templateOwner, repo, 'package.json', githubToken);
            let packageJsonContent = Buffer.from(packageJsonResponse.content, 'base64').toString('utf8');
            await modifyPackageJson(templateOwner, repo, projectName, packageJsonContent, packageJsonResponse.sha, githubToken);

            // Modify core/TabLayoutContent.tsx
            console.log('Attempting to fetch and modify core/TabLayoutContent.tsx...');
            const tabLayoutResponse = await getFileContent(templateOwner, repo, 'core/TabLayoutContent.tsx', githubToken);
            let tabLayoutContent = Buffer.from(tabLayoutResponse.content, 'base64').toString('utf8');
            await modifyTabLayoutContent(templateOwner, repo, tabLayoutContent, tabLayoutResponse.sha, store_id, githubToken);

            return util.buildResponse(200, 'Repository created and files updated successfully');
        } catch (error) {
            console.error('Error during repository creation or initialization:', error.message);
            return util.buildResponse(500, `Error during repository creation or initialization: ${error.message}`);
        }

    } catch (error) {
        console.error('Error in buyApp function:', error.message);
        return util.buildResponse(500, `Error in buyApp function: ${error.message}`);
    }
}

async function createRepository(templateOwner, templateRepo, projectName, githubToken) {
    const urlPath = `/repos/${templateOwner}/${templateRepo}/generate`;

    const postData = JSON.stringify({
        "owner": templateOwner,
        "name": projectName,
        "private": true // Set to true if you want to create a private repo
    });

    const options = {
        hostname: 'api.github.com',
        path: urlPath,
        method: 'POST',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.baptiste-preview+json',
            'User-Agent': 'Node.js',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
    }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, data: parsedData });
                } catch (error) {
                    reject(new Error(`Error parsing response from GitHub API: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Error creating repository: ${e.message}`));
        });

        req.write(postData);
        req.end();
    });
}

async function getFileContent(owner, repo, filePath, githubToken) {
    try {
        const response = await githubApiRequest(`/repos/${owner}/${repo}/contents/${filePath}`, 'GET', githubToken);
        console.log(`Fetched ${filePath} content successfully:`, response);
        return response;
    } catch (error) {
        console.error(`Error fetching ${filePath} content:`, error.message);
        throw new Error(`Error fetching ${filePath} content`);
    }
}

// async function modifyAppJson(owner, repo, projectName, appJsonContent, sha, githubToken) {
//     try {
//         appJsonContent = appJsonContent.replace('expoapptemplate', projectName)
//                                       .replace('expoapptemplate_slug', projectName.toLowerCase().replace(/\s+/g, '-'))
//                                       .replace('expoapptemplate_scheme', projectName.toLowerCase());

//         await githubApiRequest(`/repos/${owner}/${repo}/contents/app.json`, 'PUT', githubToken, {
//             message: 'Updated app.json with project details',
//             content: Buffer.from(appJsonContent).toString('base64'),
//             sha: sha // The SHA is required to update an existing file
//         });

//         console.log(`app.json updated for repository ${repo}`);
//     } catch (error) {
//         console.error('Error updating app.json:', error.message);
//         throw new Error('Error updating app.json');
//     }
// }

async function modifyAppJson(owner, repo, projectName, appJsonContent, sha, githubToken) {
    try {
        // Process the projectName for different fields
        const formattedName = projectName.replace(/\s+/g, ''); // Remove all spaces
        const formattedSlug = projectName.toLowerCase().replace(/\s+/g, '-'); // Slug: spaces to hyphens
        const formattedScheme = projectName.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''); // Scheme: remove all symbols and spaces

        // Update the app.json content 
        appJsonContent = appJsonContent
            .replace('expoapptemplate', formattedName) // Use formattedName to remove spaces
            .replace('expoappt_slug', formattedSlug) // Slug: spaces to hyphens
            .replace('expoappt_scheme', formattedScheme); // Scheme: remove all spaces and symbols

        // Make the GitHub API request to update app.json
        await githubApiRequest(`/repos/${owner}/${repo}/contents/app.json`, 'PUT', githubToken, {
            message: 'Updated app.json with project details',
            content: Buffer.from(appJsonContent).toString('base64'),
            sha: sha // The SHA is required to update an existing file
        });

        console.log(`app.json updated for repository ${repo}`);
    } catch (error) {
        console.error('Error updating app.json:', error.message);
        throw new Error('Error updating app.json');
    }
}


async function modifyPackageJson(owner, repo, projectName, packageJsonContent, sha, githubToken) {
    try {
        let packageJson = JSON.parse(packageJsonContent);
        packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-'); // Setting the name
        packageJsonContent = JSON.stringify(packageJson, null, 2); // Pretty print JSON

        await githubApiRequest(`/repos/${owner}/${repo}/contents/package.json`, 'PUT', githubToken, {
            message: 'Updated package.json with project name',
            content: Buffer.from(packageJsonContent).toString('base64'),
            sha: sha // The SHA is required to update an existing file
        });

        console.log(`package.json updated for repository ${repo}`);
    } catch (error) {
        console.error('Error updating package.json:', error.message);
        throw new Error('Error updating package.json');
    }
}

async function modifyTabLayoutContent(owner, repo, tabLayoutContent, sha, store_id, githubToken) {
    try {
        tabLayoutContent = tabLayoutContent.replace('{{STORE_ID}}', store_id);

        await githubApiRequest(`/repos/${owner}/${repo}/contents/core/TabLayoutContent.tsx`, 'PUT', githubToken, {
            message: 'Updated core/TabLayoutContent.tsx with store ID',
            content: Buffer.from(tabLayoutContent).toString('base64'),
            sha: sha // The SHA is required to update an existing file
        });

        console.log(`core/TabLayoutContent.tsx updated for repository ${repo}`);
    } catch (error) {
        console.error('Error updating core/TabLayoutContent.tsx:', error.message);
        throw new Error('Error updating core/TabLayoutContent.tsx');
    }
}

function githubApiRequest(path, method, token, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: method,
            headers: {
                'Authorization': `token ${token}`,
                'User-Agent': 'Node.js',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (error) {
                        reject(new Error('Error parsing response data'));
                    }
                } else {
                    reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Error with GitHub API request: ${e.message}`));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.buyApp = buyApp;

