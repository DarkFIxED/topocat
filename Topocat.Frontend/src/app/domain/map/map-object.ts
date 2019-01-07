import { DomainEntity } from '../../infrastructure/domain-entity';
import { UUID } from 'angular2-uuid';
import { JsonProperty } from 'json2typescript';

export abstract class MapObject extends DomainEntity {
    @JsonProperty('uuid')
    public uuid: string = UUID.UUID();

    public constructor() {
        super();
    }
}