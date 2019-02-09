import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'tc-main-card',
    templateUrl: './main-card.component.html',
    styleUrls: ['./main-card.component.scss']
})
export class MainCardComponent implements OnInit {

    links = [
        {
            title: 'Items',
            url: 'items',
            icon: 'list'
        },
        {
            title: 'Save',
            url: 'save',
            icon: 'cloud_download'
        },
        {
            title: 'Load',
            url: 'load',
            icon: 'cloud_upload'
        }
    ];

    activeLink;

    constructor(public router: Router,
                public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.activateLink(this.links[0]);
    }

    activateLink(link: { icon: string; title: string; url: string }) {

        this.activeLink = link;

        this.router.navigate([link.url], {
            queryParamsHandling: 'merge',
            relativeTo: this.route
        });
    }
}
