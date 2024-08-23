import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { AlunoService } from '../../application/services/alunos.service';
  import { CreateAlunoDto } from '../../application/dto/create-aluno.dto';
  import { Aluno } from '../../domain/entities/aluno.entity';
  
  @Controller('aluno')
  export class AlunoController {
    constructor(private readonly alunoService: AlunoService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async cadastrar(@Body() createAlunoDto: CreateAlunoDto): Promise<Aluno> {
      return this.alunoService.cadastrar(createAlunoDto);
    }
  }