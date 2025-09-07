import { FastifyReply, FastifyRequest, HookHandlerDoneFunction, preHandlerHookHandler } from 'fastify';

type GenericHandler = (input: FastifyRequest, reply: FastifyReply) => Promise<void>;

export class RouterHelper {
  private static preHandler(controller: GenericHandler): preHandlerHookHandler {
    return (input: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
      controller(input, reply)
        .then(() => done())
        .catch(done);
    };
  }

  static wrapPreHandlers(...controllers: readonly GenericHandler[]): preHandlerHookHandler[] {
    return controllers.map((c) => this.preHandler(c));
  }
}
