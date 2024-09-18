import { Controller, Get, Post, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('load')
  @ApiOperation({
    summary:
      'Check how many users are registered in the database and, if there are no records, add 200 entries from the Rick and Morty API.',
  })
  async loadCharacters() {
    await this.charactersService.saveCharacters();
    return { message: '200 characters loaded into the database' };
  }

  @Get('getData')
  @ApiOperation({
    summary:
      'Retrieves the list of characters from the database, supporting pagination and allowing you to specify how many results you want to see, while also filtering by the names of the characters stored in the database.',
  })
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

  @ApiOperation({
    summary:
      'Check how many characters are missing to reach 200 records. If any characters are missing, add enough characters to reach 200. If no characters are missing, do not add any more records.',
  })
  @Post('upsert')
  async refreshCharactersWithUpsert(): Promise<void> {
    await this.charactersService.upsert();
    console.log('Upsert completed');
  }
}
