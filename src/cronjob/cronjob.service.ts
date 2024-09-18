// characters/characters.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CharactersService } from 'src/characters/characters.service';

@Injectable()
export class CronjobService {
  constructor(private readonly charactersService: CharactersService) {}

  @Cron('*/30 * * * *')
  async handleCron() {
    console.log('actualización de personajes.');
    await this.charactersService.saveCharacters();
  }
}
