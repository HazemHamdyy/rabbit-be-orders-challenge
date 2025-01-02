import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pushover from 'pushover-notifications';

@Injectable()
export class NotificationService {
  private pushover: Pushover;

  constructor(private configService: ConfigService) {
    this.pushover = new Pushover({
      // YOU MUST PROVIDE YOUR CREDENTIALS FIRST (PUSHOVER_USER, PUSHOVER_TOKEN) IN THE .env FILE
      user: this.configService.get<string>('PUSHOVER_USER'),
      token: this.configService.get<string>('PUSHOVER_TOKEN'),
    });
  }

  async sendNotification(title: string, message: string): Promise<void> {
    const msg = {
      title,
      message,
      sound: 'magic', // NICE SOUND
      priority: 1,
    };
    // IF YOU HAVE CREADINTIALS SEND NOTIFICATIONS
    if (
      this.configService.get<string>('PUSHOVER_USER') &&
      this.configService.get<string>('PUSHOVER_TOKEN')
    ) {
      return new Promise(() => {
        this.pushover.send(msg, (err) => {
          if (err) {
            console.warn(err);
            return;
          }
        });
      });
    }
  }
}
