# Jenkins CI/CD Setup for Code-Sync

This directory contains Jenkins pipeline configurations for the Code-Sync project.

## 📁 Pipeline Files

- **`/Jenkinsfile`** - Root pipeline that orchestrates both client and server builds
- **`/server/Jenkinsfile`** - Server-specific pipeline for Node.js/Express backend
- **`/client/Jenkinsfile`** - Client-specific pipeline for React/Vite frontend

## 🚀 Prerequisites

### Jenkins Plugins Required

1. **Docker Pipeline** - For Docker build and push operations
2. **NodeJS Plugin** - For Node.js environment setup
3. **Git Plugin** - For source code management
4. **Pipeline** - Core pipeline functionality
5. **Credentials Binding** - For managing secrets

### Optional Plugins

1. **Timestamper** - Adds timestamps to console output (removed from pipelines for compatibility)
   - If you want timestamps, install this plugin and add `timestamps()` to the `options` block in each Jenkinsfile

### Jenkins Credentials Setup

Configure the following credentials in Jenkins:

1. **`dockerhub-credentials`** (Username with password)
   - ID: `dockerhub-credentials`
   - Type: Username with password
   - Description: Docker Hub credentials for pushing images

2. **`vite-backend-url`** (Secret text)
   - ID: `vite-backend-url`
   - Type: Secret text
   - Description: Backend URL for Vite frontend (e.g., `http://localhost:3000`)

### Node.js Installation

Install Node.js in Jenkins:
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Add NodeJS installation named `Node 18`
3. Select version 18.x or higher

## 🔧 Pipeline Configuration

### Root Pipeline (Jenkinsfile)

The root pipeline orchestrates the entire build process:

- **Parallel Builds**: Builds client and server simultaneously
- **Docker Images**: Creates Docker images for both services
- **Push to Registry**: Pushes images to Docker Hub (on main branch)
- **Deployment**: Deploys using docker-compose (on main branch)

### Server Pipeline (server/Jenkinsfile)

Server-specific pipeline includes:

- Node.js setup and dependency installation
- TypeScript compilation
- Docker image build
- Security scanning with Trivy
- Image push to registry

### Client Pipeline (client/Jenkinsfile)

Client-specific pipeline includes:

- Node.js setup and dependency installation
- ESLint linting
- TypeScript type checking
- Vite build with environment variables
- Docker image build
- Security scanning
- Artifact archiving

## 📝 Usage

### Setting Up a New Jenkins Job

#### Option 1: Multibranch Pipeline (Recommended)

1. Create a new **Multibranch Pipeline** job
2. Configure the Git repository URL
3. Set the branch source (e.g., GitHub, GitLab)
4. Jenkins will automatically discover the Jenkinsfile in the root

#### Option 2: Single Branch Pipeline

1. Create a new **Pipeline** job
2. Under **Pipeline** section, select **Pipeline script from SCM**
3. Choose **Git** as SCM
4. Enter repository URL
5. Set script path to `Jenkinsfile`

### Running Individual Pipelines

To run server or client pipelines independently:

1. Create separate pipeline jobs
2. Set script path to `server/Jenkinsfile` or `client/Jenkinsfile`

## 🐳 Docker Registry Configuration

By default, pipelines push to Docker Hub (`docker.io`). To use a different registry:

1. Update the `DOCKER_REGISTRY` environment variable in Jenkinsfiles
2. Update credentials ID if needed
3. Example for private registry:
   ```groovy
   environment {
       DOCKER_REGISTRY = 'registry.example.com'
       DOCKER_CREDENTIALS_ID = 'private-registry-creds'
   }
   ```

## 🔐 Environment Variables

### Server Pipeline

- `NODE_VERSION` - Node.js version (default: 18)
- `DOCKER_REGISTRY` - Docker registry URL
- `IMAGE_NAME` - Docker image name
- `IMAGE_TAG` - Build number used as tag

### Client Pipeline

- `NODE_VERSION` - Node.js version (default: 18)
- `VITE_BACKEND_URL` - Backend API URL (from credentials)
- `DOCKER_REGISTRY` - Docker registry URL
- `IMAGE_NAME` - Docker image name
- `IMAGE_TAG` - Build number used as tag

## 🚢 Deployment

The root pipeline includes a deployment stage that:

1. Runs only on the `main` branch
2. Stops existing containers
3. Pulls latest images
4. Starts containers using docker-compose

### Customizing Deployment

Modify the `Deploy` stage in the root Jenkinsfile:

```groovy
stage('Deploy') {
    when {
        branch 'main'
    }
    steps {
        script {
            // Add your deployment logic here
            // Examples:
            // - Deploy to Kubernetes
            // - Deploy to AWS ECS
            // - Deploy to Docker Swarm
            // - SSH to remote server
        }
    }
}
```

## 🔍 Security Scanning

Pipelines include Trivy security scanning for Docker images. To customize:

```groovy
sh """
    docker run --rm \
        -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy:latest image \
        --severity HIGH,CRITICAL \
        --exit-code 1 \
        ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
"""
```

Remove `|| true` to fail the build on security issues.

## 📊 Build Artifacts

Client pipeline archives the `dist/` directory containing the built frontend files. Access artifacts from:

- Jenkins job page → Build number → Build Artifacts

## 🔄 Webhook Configuration

For automatic builds on code push:

### GitHub

1. Go to repository **Settings** → **Webhooks**
2. Add webhook URL: `http://your-jenkins-url/github-webhook/`
3. Select **Just the push event**

### GitLab

1. Go to repository **Settings** → **Webhooks**
2. Add webhook URL: `http://your-jenkins-url/project/YOUR_JOB_NAME`
3. Select **Push events**

## 🐛 Troubleshooting

### Docker Permission Issues

If Jenkins can't access Docker:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Node.js Not Found

Ensure NodeJS plugin is installed and configured in Global Tool Configuration.

### Build Fails on Dependencies

Clear npm cache:

```groovy
sh 'npm cache clean --force'
sh 'rm -rf node_modules package-lock.json'
sh 'npm install'
```

## 📚 Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [NodeJS Plugin](https://plugins.jenkins.io/nodejs/)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)

## 🤝 Contributing

When modifying pipelines:

1. Test changes in a feature branch
2. Verify builds complete successfully
3. Update this README if adding new features
4. Submit pull request for review
