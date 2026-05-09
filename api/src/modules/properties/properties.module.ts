import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './application/services/property.service';
import { PropertyController } from './presentation/controllers/property.controller';
import { PropertyRepository } from './domain/repositories/property.repository';
import { TypeOrmPropertyRepository } from './infrastructure/repositories/typeorm-property.repository';
import { PropertySchema } from './infrastructure/repositories/property.schema';

@Module({
  imports: [TypeOrmModule.forFeature([PropertySchema])],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    {
      provide: PropertyRepository,
      useClass: TypeOrmPropertyRepository,
    },
  ],
  exports: [PropertyService, PropertyRepository],
})
export class PropertyModule {}
