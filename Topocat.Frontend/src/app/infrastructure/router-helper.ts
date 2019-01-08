import { ActivatedRoute } from '@angular/router';

export class RouterHelper {
    static getDeepestActivatedRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
        let route = activatedRoute;
        while (route.firstChild) {
            route = route.firstChild
        }
        return route;
    }
}