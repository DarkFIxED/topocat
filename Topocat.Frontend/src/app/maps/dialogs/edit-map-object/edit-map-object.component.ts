import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialogRef} from '@angular/material';
import {MapObjectModel} from '../../models/map-object.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogResult} from '../../../core/models/dialog-result';
import {EditObjectTypesActions} from '../../models/edit-object-types-actions';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable, Subject} from 'rxjs';
import {debounceTime, filter, map, switchMap, takeUntil} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {MapsHttpService} from '../../../auth-core/services/maps.http.service';

@Component({
    selector: 'app-edit-map-object',
    templateUrl: './edit-map-object.component.html',
    styleUrls: ['./edit-map-object.component.scss']
})
export class EditMapObjectComponent extends BaseDestroyable implements OnInit {

    private readonly MinTagAutocompleteThreshold = 3;

    @ViewChild('tagInput', {static: false})
    tagInput: ElementRef<HTMLInputElement>;

    @ViewChild('auto', {static: false})
    matAutocomplete: MatAutocomplete;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    foundTags$: Observable<string[]>;
    startSearchTags = new Subject<string>();

    mapObjectForm = new FormGroup({
        id: new FormControl(undefined, [Validators.required]),
        createdAt: new FormControl(Date.now().toString(), [Validators.required]),
        lastModifiedAt: new FormControl(Date.now().toString(), [Validators.required]),
        title: new FormControl(undefined, [Validators.required]),
        description: new FormControl(undefined),
        wktString: new FormControl(undefined, [Validators.required]),
        tags: new FormArray([])
    });

    data: { model: MapObjectModel, isNewObject: boolean, mapId: string };

    constructor(public dialogRef: MatDialogRef<EditMapObjectComponent, DialogResult<{ action: EditObjectTypesActions, data: MapObjectModel }>>,
                private mapsHttpService: MapsHttpService,
                @Inject(MAT_DIALOG_DATA) data: any) {
        super();

        this.data = data as { model: MapObjectModel, isNewObject: boolean, mapId: string };

        this.mapObjectForm.patchValue(this.data.model);
        const tagsFormArray = this.mapObjectForm.controls.tags as FormArray;
        this.data.model.tags.forEach(tag => tagsFormArray.push(new FormControl(tag)));
    }

    ngOnInit(): void {
        this.foundTags$ = this.startSearchTags
            .pipe(
                filter(searchString => !!searchString && searchString.length >= this.MinTagAutocompleteThreshold),
                debounceTime(200),
                switchMap(searchString => this.mapsHttpService.searchTags(this.data.mapId, searchString)),
                filter(result => result.isSuccessful),
                map(result => result.data.result),
                map(results => {
                    const tagsFormArray = this.mapObjectForm.controls.tags as FormArray;
                    const existingValues = tagsFormArray.value as string[];
                    return results.filter(resultItem => !existingValues.some(existingValue => existingValue === resultItem));
                }),
                takeUntil(this.componentAlive$)
            );
    }

    onNoClick() {
        this.dialogRef.close(DialogResult.Cancel());
    }

    onOkClick() {
        if (this.mapObjectForm.invalid) {
            return;
        }

        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.Finished, data: this.mapObjectForm.value}));
    }

    onDrawClick() {
        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.RedrawRequested, data: this.data.model}));
    }

    onDeleteClick() {
        this.dialogRef.close(DialogResult.Ok({action: EditObjectTypesActions.RemoveRequested, data: this.data.model}));
    }

    onTagRemove(i: number) {
        const array = this.mapObjectForm.controls.tags as FormArray;
        array.removeAt(i);
    }

    onTagSelected(event: MatAutocompleteSelectedEvent) {
        this.addTagToForm(event.option.viewValue);
    }

    addTag(event: MatChipInputEvent) {
        if (this.matAutocomplete.isOpen)
            return;

        if (!event.value || !event.value.length)
            return;

        const existingTags = this.mapObjectForm.controls.tags.value as string[];

        if (existingTags.some(existingTag => existingTag === event.value))
            return;

        this.addTagToForm(event.value);
    }

    onTagsInputChanged(event) {
        setTimeout(() => {
            this.startSearchTags.next(this.tagInput.nativeElement.value);
        });
    }

    private addTagToForm(viewValue: string) {
        const array = this.mapObjectForm.controls.tags as FormArray;
        array.push(new FormControl(viewValue));

        this.tagInput.nativeElement.value = '';
    }
}
