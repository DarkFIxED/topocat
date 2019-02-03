import { JsonConvert, JsonConverter, JsonCustomConvert } from 'json2typescript';
import { MapObject } from '../../domain/map/map-object';
import { Place } from '../../domain/map/place';
import { Area } from '../../domain/map/area';

@JsonConverter
export class MapObjectsArrayConverter extends JsonConvert implements JsonCustomConvert<MapObject[]> {

    protected readonly typeProperty = '_type';

    serialize(data: MapObject[]): any {

        if (!data) {
            return data;
        }

        return data.map(item => {
            let serializedObject = super.serialize(item);
            serializedObject[this.typeProperty] = item.constructor.name;
            return serializedObject;
        });
    }

    deserialize(data: any[]): MapObject[] {

        if (!data) {
            return data;
        }

        return data.map(item => {

            let type: { new(): any; };

            switch (item[this.typeProperty]) {
                case 'Place':
                    type = Place;
                    break;
                case 'Area':
                    type = Area;
                    break;
                default:
                    throw new Error('Unknown deserealizing type');
            }

            return super.deserialize(item, type);
        });
    }

}