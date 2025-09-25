import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export abstract class BaseService<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
    protected readonly idField: string,
  ) {}

  // Abstract methods that must be implemented by child classes
  abstract getModel(): Record<string, any>;
  abstract getIncludeOptions(): Record<string, any>;

  async findOne(id: number): Promise<T> {
    const model = this.getModel();
    const item = await model.findUnique({
      where: { [this.idField]: id },
      include: this.getIncludeOptions(),
    });

    if (!item) {
      throw new NotFoundException(`${this.modelName} with ID ${id} not found`);
    }

    return item as T;
  }

  async findAll(where: Record<string, any> = {}): Promise<T[]> {
    const model = this.getModel();
    return model.findMany({
      where,
      orderBy: { [this.idField]: 'asc' },
      include: this.getIncludeOptions(),
    }) as Promise<T[]>;
  }

  async remove(id: number): Promise<T> {
    await this.findOne(id); // This will throw NotFoundException if not found

    const model = this.getModel();
    return model.delete({
      where: { [this.idField]: id },
    }) as Promise<T>;
  }

  async create(createDto: CreateDto): Promise<T> {
    const model = this.getModel();
    return model.create({
      data: createDto,
      include: this.getIncludeOptions(),
    }) as Promise<T>;
  }

  async update(id: number, updateDto: UpdateDto): Promise<T> {
    await this.findOne(id); // This will throw NotFoundException if not found

    const model = this.getModel();
    return model.update({
      where: { [this.idField]: id },
      data: updateDto,
      include: this.getIncludeOptions(),
    }) as Promise<T>;
  }
}
