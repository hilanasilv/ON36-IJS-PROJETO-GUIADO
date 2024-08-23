import { Test, TestingModule } from '@nestjs/testing';
import { AlunoService } from '../src/application/services/alunos.service';
import { CreateAlunoDto } from '../src/application/dto/create-aluno.dto';
import { Aluno } from '../src/domain/entities/aluno.entity';
import { AlunoRepository } from '../src/repositories/infrastructure/alunos.repository';

describe('AlunoService', () => {
  let service: AlunoService;
  let mockAlunoRepository: Partial<AlunoRepository>;

  beforeEach(async () => {
    mockAlunoRepository = {
      listar: jest.fn(),
      criar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoService,
        { provide: AlunoRepository, useValue: mockAlunoRepository },
      ],
    }).compile();

    service = module.get<AlunoService>(AlunoService);
  });

  it('Deve cadastrar um aluno', async () => {
    const createAlunoDto: CreateAlunoDto = {
      nome: 'Hilana Silva',
      endereco: 'Rua Praia de Aruana, 195',
      telefone: '12355689',
      email: 'hilanacs@gmail.com',
      curso: 'Java',
      anoNascimento: 2000,
    };

    const aluno: Aluno = {
      id: 'some-uuid',
      ...createAlunoDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAlunoRepository.listar = jest.fn().mockReturnValue([]);
    mockAlunoRepository.criar = jest.fn().mockReturnValue(aluno);

    const resultado = await service.cadastrar(createAlunoDto);

    expect(resultado).toBeDefined();
    expect(resultado.nome).toBe(createAlunoDto.nome);
    expect(resultado.id).toBeDefined();
    expect(mockAlunoRepository.criar).toHaveBeenCalledWith(resultado);
  });
});