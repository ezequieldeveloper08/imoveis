import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertyService } from '../../application/services/property.service';
import { CreatePropertyDto, UpdatePropertyDto } from '../dtos/property.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('properties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post()
  @ApiOperation({ summary: 'Create property' })
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    return this.propertyService.create({
      ...createPropertyDto,
      organizationId: req.user.organizationId,
    });
  }
  
  @Post('upload')
  @ApiOperation({ summary: 'Upload property images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadFile(@UploadedFiles() files: any[]) {
    const uploadedFiles = files as Array<{ filename: string; originalname: string; size: number }>;
    return uploadedFiles.map(file => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size
    }));
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties from organization' })
  findAll(@Request() req) {
    return this.propertyService.findByOrganization(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by id' })
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update property' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property' })
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
