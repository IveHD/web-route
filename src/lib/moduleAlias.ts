/**
 * ts识别`@`
 */
import path from 'path';
import moduleAlias from 'module-alias';

moduleAlias.addAlias('@', path.join(__dirname, '../../src'));
