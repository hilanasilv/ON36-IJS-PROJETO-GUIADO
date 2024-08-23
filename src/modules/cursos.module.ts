import { Module } from '@nestjs/common';
import { CursosService } from '../application/services/cursos.service';
import { CursosController } from '../adapters/controllers/cursos.controller';
import { CursosRepository } from '../repositories/infrastructure/cursos.repository';
import { AlunoRepository } from '../repositories/infrastructure/alunos.repository';
import { PresencaRepository } from '../repositories/infrastructure/presenca.repository'; 

@Module({
  imports: [],
  controllers: [CursosController],
  providers: [
    CursosService,
    CursosRepository,
    AlunoRepository,
    PresencaRepository, 
  ],
  exports: [CursosRepository],
})
export class CursosModule {}