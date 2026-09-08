import { SessionRepository } from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import { SessionController } from "../controllers/session.controller";

class Container {
    static init() {
        const repositories = {
            sessionRepository: new SessionRepository(),
        };

        const services = {
            sessionService: new SessionService(repositories.sessionRepository),
        };

        const controller = {
            sessionController: new SessionController(services.sessionService),
        };

        return { repositories, services, controller };
    }
}

const initialized = Container.init();
const { sessionController } = initialized.controller;

export { Container };
export { sessionController };
export default initialized;
