import { Module } from '@nestjs/common';
import { AlunoService } from '../application/services/alunos.service';
import { AlunosController } from '';

@Module({
  controllers: [AlunosController],
  providers: [AlunoService],
})
export class AlunosModule {}
