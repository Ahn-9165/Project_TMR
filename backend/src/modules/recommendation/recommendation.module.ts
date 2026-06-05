import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [WeatherModule, RestaurantModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
