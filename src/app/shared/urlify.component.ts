import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-urlify',
    standalone: true,
    imports: [CommonModule,RouterLink],
    template: `
        <a *ngIf="custRouterLink else a" [routerLink]="custRouterLink">
            <ng-template [ngTemplateOutlet]="template"></ng-template>
        </a>
        <ng-template #a>
            <a [href]="href">
                <ng-template [ngTemplateOutlet]="template"></ng-template>
            </a>
        </ng-template>`,
    styles: [ 'a {text-decoration: unset;}' ],
})
export class UrlifyComponent{
    template!: TemplateRef<any>;
    href!: string;
    custRouterLink!: string | any[];
}