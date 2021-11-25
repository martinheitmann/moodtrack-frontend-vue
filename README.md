# MoodTrack Frontend

MoodTrack Frontent is an administration frontent written in Vue for the MoodTrack backend service. It is based off of the CoreUI library for rapid prototyping of control panel layouts. 

## Installation

Prior to installing, a [Firebase](https://firebase.google.com/docs?authuser=0) project must be created in order to enable authentication features. 

### Setting up for development
Before you can set up a development environment, credentials for your Firebase project must be provided. This can be done through dotfiles, and is most easily achieved by creating a ```.env.development.local``` file which contains your credentials: 
````
VUE_APP_API_KEY=
VUE_APP_AUTH_DOMAIN=
VUE_APP_DATABASE_URL=
VUE_APP_PROJECT_ID=
VUE_APP_STORAGE_BUCKET=
VUE_APP_MESSAGING_SENDER_ID=
VUE_APP_APP_ID=
VUE_APP_MEASUREMENT_ID=
VUE_APP_SERVER_URI=http://localhost:4000/graphql
````
With the credentials provided use the command ```npm run serve``` to start the server in development mode. 

For manual deployment, you can similarly create a ```env.production.local``` dotfile which will be automatically read in production mode. 

### Manual deployment
In order to deploy the project manually, run ```npm install``` in the folder which the project is located on your server followed by ```npm run build```. Consult the [deployment guide for Vue](https://cli.vuejs.org/guide/deployment.html) when configuring with nginx or a HTTP server.

### Deployment with Jenkins
A ```Jenkinsfile``` is provided for automatic deployment with Jenkins. Ensure that your credentials are available in the build step when deploying via Jenkins and that the folder paths match the actual location of your configuration. 
