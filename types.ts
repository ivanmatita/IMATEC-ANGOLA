
export interface Empresa {
  id: string;
  nome_empresa: string;
  nif_empresa: string;
  nome: string;
  nif: string;
  administrador: string;
  contacto: string;
  email: string;
  tipo_empresa: string;
  created_at: string;
}

export interface User {
  id: string;
  empresa_id: string;
  nome: string;
  username: string;
  email: string;
  role: 'admin' | 'operador' | 'contabilista';
}

export type TipoContrato = 'Indeterminado' | 'Termo Certo' | 'Termo Incerto' | 'Estágio';
export type EstadoFuncionario = 'Ativo' | 'Inativo' | 'Férias' | 'Suspenso';

export interface Funcionario {
  id: string;
  empresa_id: string;
  nome: string;
  bi: string;
  nif: string;
  data_nascimento: string;
  estado_civil: string;
  nacionalidade: string;
  morada: string;
  contacto: string;
  email: string;
  profissao: string;
  cargo: string;
  tipo_contrato: TipoContrato;
  data_admissao: string;
  salario_base: number;
  dependentes: number;
  regime_trabalho: string;
  estado: EstadoFuncionario | string;
}

export interface Faturacao {
  id: string;
  empresa_id: string;
  numero: string;
  cliente: string;
  total: number;
  estado: string;
  created_at: string;
}

export interface ProcessamentoSalario {
  funcionario_id: string;
  mes: number;
  ano: number;
  liquido: number;
  estado: string;
}

export interface EfetividadeDiaria {
  id: string;
  funcionario_id: string;
  empresa_id: string;
  mes: number;
  ano: number;
  registos: Record<number, string>;
  horas_extra: Record<number, number>;
  horas_perdidas: Record<number, number>;
  abonos: number;
  subsidios: number;
  premios: number;
  adiantamentos: number;
  observacoes: string;
}

export enum AppRoute {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
  RH = '/rh',
  FATURACAO = '/faturacao',
  STOCK = '/stock',
  POS = '/pos',
  CONTABILIDADE = '/contabilidade',
  FORNECEDORES = '/fornecedores',
  ADMIN = '/admin',
  CONFIG = '/config'
}
