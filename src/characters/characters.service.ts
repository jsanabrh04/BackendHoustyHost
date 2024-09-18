import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Character } from './characters.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private characterRepo: Repository<Character>,
  ) {}

  async saveCharacters(): Promise<void> {
    const count = await this.characterRepo.count();

    if (count >= 200) {
      console.log('There are already 200 characters!');
      return;
    }

    let allCharacters = [];

    const totalPages = 10;

    for (let page = 1; page <= totalPages; page++) {
      const { data } = await axios.get(
        `https://rickandmortyapi.com/api/character?page=${page}`,
      );
      const characters = data.results.map((char) => ({
        name: char.name,
        status: char.status,
        species: char.species,
        gender: char.gender,
        location: char.location.name,
      }));
      allCharacters = [...allCharacters, ...characters];
    }

    await this.characterRepo.save(allCharacters);
    console.log('Save Characters');
  }

  async getCharacters(name: string, page: number, limit: number) {
    const query = this.characterRepo.createQueryBuilder('character');

    if (name) {
      query.where('character.name ILIKE :name', { name: `%${name}%` });
    }

    query.skip((page - 1) * limit).take(limit);

    return await query.getManyAndCount();
  }

  async upsert(): Promise<void> {
    const totalCharacters = 200;
    const existingCharacters = await this.characterRepo.find();
    const existingIds = new Set(existingCharacters.map((char) => char.id));
    const existingCount = existingCharacters.length;
    const charactersNeeded = totalCharacters - existingCount;
    if (charactersNeeded <= 0) {
      console.log('No need to upsert, already have 200 characters');
      return;
    }
    let allCharacters: any[] = [];
    const totalPages = 10;

    for (let page = 1; page <= totalPages; page++) {
      const { data } = await axios.get(
        `https://rickandmortyapi.com/api/character?page=${page}`,
      );

      const characters = data.results.map((char: any) => ({
        id: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        gender: char.gender,
        location: char.location.name,
      }));

      allCharacters = [...allCharacters, ...characters];

      if (allCharacters.length >= totalCharacters) {
        break;
      }
    }
    const uniqueCharacters = Array.from(
      new Map(allCharacters.map((item) => [item.id, item])).values(),
    );
    const newCharacters = uniqueCharacters.filter(
      (character) => !existingIds.has(character.id),
    );
    const charactersToAdd = newCharacters.slice(0, charactersNeeded);
    if (charactersToAdd.length > 0) {
      await this.characterRepo.save(charactersToAdd);
      console.log('Database updated with additional characters');
    } else {
      console.log('No new characters needed');
    }
  }
}
