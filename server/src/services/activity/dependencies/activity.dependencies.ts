import { getRedisClient } from "@/shared/config/redis";
import { ActivityController } from "@/services/activity/controllers/activity.controller";
import { ActivityRepository } from "@/services/activity/repositories/activity.repository";
import { ActivityService } from "@/services/activity/services/activity.service";

class Container {
    static init() {
        const repositories = {
            activityRepository: new ActivityRepository(),
        };

        const services = {
            activityService: new ActivityService(
                repositories.activityRepository,
                getRedisClient(),
            ),
        };

        const controller = {
            activityController: new ActivityController(services.activityService),
        };

        return {
            repositories,
            services,
            controller,
        };
    }
}

const initialized = Container.init();
const { activityController } = initialized.controller;

export { Container, activityController };
export default initialized;
