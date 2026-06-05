import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  getRecommendation(
    @Query('lat') lat = '37.5665',
    @Query('lng') lng = '126.9780',
    @Query('alcohol') alcohol?: string,
    @Query('foodCategory') foodCategory?: string,
  ) {
    return this.recommendationService.getRecommendation({
      lat: Number(lat),
      lng: Number(lng),
      alcohol,
      foodCategory,
    });
  }
}
