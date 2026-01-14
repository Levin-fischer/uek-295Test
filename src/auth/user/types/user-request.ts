import { ReturnUserDto } from '../dto';
import { CorrelationIdRequest } from '../../../decorators/correlation-id-request';

export type UserRequest = CorrelationIdRequest & { user: ReturnUserDto };
