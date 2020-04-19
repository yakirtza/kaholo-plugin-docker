# kaholo-plugin-docker

The Kaholo Plugin for Docker is based on [Dockerode npm package](https://www.npmjs.com/package/dockerode)

## Method: Build Docker Image

**Description**

This method create a new docker image with a new tag from a docker file 
Based on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/image_build/)

```docker image build```

**Parameters**

1) Path to dockerfile
2) Tag for the new Image

## Method: Pull Image

**Description**

This method pulls an Image from a repo such as Docker Hub.
Based on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/pull/)

```docker pull [OPTIONS] NAME[:TAG|@DIGEST]```

**Parameters**

1) Username & Password - can be given as Plugin Setting or in the pipeline.
2) Registry name (Optional) - if empty, assume docker hub as a default.
3) Image name
4) Image tag







