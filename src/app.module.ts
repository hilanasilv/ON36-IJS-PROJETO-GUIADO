import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlunosModule } from './alunos/alunos.module';
import { AlunosService } from './alunos/alunos.service';

@Module({
  imports: [AlunosModule],
  controllers: [AppController],
  providers: [AppService, AlunosService],
})
export class AppModule {}
