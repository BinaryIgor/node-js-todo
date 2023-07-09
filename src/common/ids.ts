import crypto from 'crypto';
import { UUID } from './types';

export function newId(): UUID {
    return crypto.randomUUID({disableEntropyCache: true});
}