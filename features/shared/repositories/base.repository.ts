import { PrismaClient } from "@prisma/client";

export interface IRepository<T> {
  findMany(filter?: Record<string, any>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Record<string, any>): Promise<T>;
  update(id: string, data: Record<string, any>): Promise<T>;
  delete(id: string): Promise<T>;
}

export abstract class BaseRepository<T> implements IRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  // Helper helper to dynamic fetch model delegate from prisma
  protected get modelDelegate() {
    const delegate = (this.prisma as any)[this.modelName];
    if (!delegate) {
      throw new Error(`Prisma delegate for model "${this.modelName}" not found.`);
    }
    return delegate;
  }

  async findMany(filter?: Record<string, any>): Promise<T[]> {
    return this.modelDelegate.findMany({
      where: filter,
    });
  }

  async findById(id: string): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    });
  }

  async create(data: Record<string, any>): Promise<T> {
    return this.modelDelegate.create({
      data,
    });
  }

  async update(id: string, data: Record<string, any>): Promise<T> {
    return this.modelDelegate.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.modelDelegate.delete({
      where: { id },
    });
  }
}
