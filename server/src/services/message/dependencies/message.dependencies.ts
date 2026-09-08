import { MessageRepository } from "../repositories/message.repository";
import { MessageService } from "../services/message.service";
import { MessageController } from "../controllers/message.controller";

class Container {
    static init() {
        const repositories = {
            messageRepository: new MessageRepository(),
        };

        const services = {
            messageService: new MessageService(repositories.messageRepository),
        };

        const controller = {
            messageController: new MessageController(services.messageService),
        };

        return { repositories, services, controller };
    }
}

const initialized = Container.init();
const { messageController } = initialized.controller;

export { Container };
export { messageController };
export default initialized;
