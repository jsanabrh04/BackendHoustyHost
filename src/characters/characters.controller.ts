import { Controller, Get, Post, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('load')
  async loadCharacters() {
    await this.charactersService.saveCharacters();
    return { message: '200 characters loaded into the database' };
  }

  @Get('getData')
  async listCharacters(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [characters, total] = await this.charactersService.getCharacters(
      name,
      page,
      limit,
    );

    return {
      data: characters,
      total,
      page,
      limit,
    };
  }

  @Post('upsert')
  async refreshCharactersWithUpsert(): Promise<void> {
    await this.charactersService.upsert();
    console.log('Upsert completed');
  }
}
