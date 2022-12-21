import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/cards')
@UseGuards(AuthGuard('jwt'))
export class CardsController {
  @Get()
  getAllCards() {
    return [
      { text: 'test card text', imageUrl: 'testImageUrl' },
      { text: 'test card text', imageUrl: 'testImageUrl' },
      { text: 'test card text', imageUrl: 'testImageUrl' },
      { text: 'test card text', imageUrl: 'testImageUrl' },
      { text: 'test card text', imageUrl: 'testImageUrl' },
      { text: 'test card text', imageUrl: 'testImageUrl' },
    ];
  }
}
