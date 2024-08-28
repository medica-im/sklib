import type { MapData } from '$lib/interfaces/mapData.interface.ts';
import type { Facility, Address } from '$lib/interfaces/facility.interface.ts';

export const createMapData = (address: Address, facilityName: string) => {
    const mapData: MapData[] = [
        {
        latLng: [Number(address?.latitude ?? 0), Number(address?.longitude ?? 0)],
        zoom: address?.zoom ?? 0,
        tooltip: {
            text: facilityName,
            permanent: false,
            direction: "auto",
            opacity: 0.7
        }
        }
    ];
    return mapData;
};

export const createFacilitiesMapData = (facilities: Facility[], tooltip=false) => {
    const points: MapData[] = [];
    facilities.forEach((item: Facility)=>{
        points.push({
            latLng: [Number(item.address?.latitude ?? 0), Number(item.address?.longitude ?? 0)],
            zoom: item?.address?.zoom ?? 0,
            tooltip: {
                text: item.address.tooltip_text||item.label||item.name,
                permanent: tooltip,
                direction: item.address.tooltip_direction||"auto",
                opacity: 0.7
            }
    });
    });
    return points;
};