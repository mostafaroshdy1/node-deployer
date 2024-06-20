import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { Repo } from '@prisma/client';

@Injectable()
export class DockerService {
  // constructor(private readonly dockerImageService: DockerImageService) {}
  private runScript(scriptName: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../src/scripts', scriptName);
      const command = `sudo ${scriptPath} ${args.join(' ')}`;
      console.log(command);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(
            `Error executing script ${scriptName} with sudo: ${error.message}`,
          );
          reject(error.message);
        } else if (stderr) {
          console.error(`Script ${scriptName} returned an error: ${stderr}`);
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  listImages(): Promise<string> {
    return this.runScript('list_docker_images.sh', []);
  }

  getImageById(imageId: string): Promise<string> {
    return this.runScript('get_image_by_id.sh', [imageId]);
  }

  getContainerById(containerId: string): Promise<string> {
    return this.runScript('get_container_by_id.sh', [containerId]);
  }

  listContainers(): Promise<string> {
    return this.runScript('list_docker_containers.sh', []);
  }

  deleteContainer(containerId: string): Promise<string> {
    return this.runScript('delete_container.sh', [containerId]);
  }
  // When you use this method you must handle deleting the containers first
  deleteImage(imageId: string): Promise<string> {
    return this.runScript('delete_image.sh', [imageId]);
  }
  // This method will delete the image and all containers that are using it
  deleteImageCascade(imageId: string): Promise<string> {
    return this.runScript('delete_image_cascade.sh', [imageId]);
  }

  createContainer(
    port: string,
    ip: string,
    memory: string,
    cpu: string,
    imageId: string,
  ): Promise<string> {
    return this.runScript('create_container.sh', [
      port,
      ip,
      memory,
      cpu,
      imageId,
    ]);
  }

  cloneRepo(repoUrl: string, path: string): Promise<string> {
    return this.runScript('clone_repo.sh', [repoUrl, path]);
  }

  generateDockerFile(nodeVersion: string, path: string): Promise<string> {
    console.log(path, nodeVersion);
    return this.runScript('generate_Dockerfile.sh', [nodeVersion, path]);
  }

  createImage(path: string, imageName: string): Promise<string> {
    return this.runScript('create_image.sh', [path, imageName]);
  }
}
