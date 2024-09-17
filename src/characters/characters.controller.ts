import { Controller, Get, Post, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('load')
  async loadCharacters() {
    await this.charactersService.fetchAndSave200Characters();
    return { message: '200 characters loaded into the database' };
  }

  @Get()
  async listCharacters(
    @Query('name') name: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const [characters, total] = await this.charactersService.getCharacters(
      name,
      page,
      limit,
    );
    return { characters, total, page, limit };
  }
}
