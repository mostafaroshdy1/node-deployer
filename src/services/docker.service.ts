
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class DockerService {
  private runScript(scriptName: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../src/scripts', scriptName);
      const command = `sudo ${scriptPath} ${args.join(' ')}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script ${scriptName} with sudo: ${error.message}`);
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
}
