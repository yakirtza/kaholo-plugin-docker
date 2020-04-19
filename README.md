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

## Method: Push to repo

**Description** 

This method push an image to a repo such as docker hub
Based on [Docker Documentation](https://docs.docker.com/engine/reference/commandline/push/)

```docker push [OPTIONS] NAME[:TAG]```

**Parameters

1) Username & Password - can be given as Plugin Setting or in the pipeline.
2) Image tag
3) Image name
4) Registry name (Optional) - if empty, assume docker hub as a default.


## Method: Tag Image

**Description** 

Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
Based on [Docker Documentation](https://docs.docker.com/engine/reference/commandline/tag/)

```docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]```

**Parameters

1) Source Registry 
2) Source Image Tag
3) New Registry
4) New Image Tag

## Method: Docker CMD

**Description**

A general command line to execute any Docker command. 

-NOTE
No need to add the docker command the string is docker + <your string>

**Parameter**

Command line a single string






