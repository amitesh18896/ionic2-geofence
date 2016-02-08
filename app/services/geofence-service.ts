import { Injectable } from "angular2/core";
import { Geofence } from "../models/geofence";

@Injectable()
export class GeofenceService {
  private geofences: Geofence[];

  create(attributes) {
    const defaultGeofence = {
      id: this.generateId(),
      latitude: 50,
      longitude: 50,
      radius: 1000,
      transitionType: TransitionType.ENTER,
      notification: {
        id: this.getNextNotificationId(),
        title: "Ionic geofence example",
        text: "",
        icon: "res://ic_menu_mylocation",
        openAppOnClick: true,
      },
    };

    return Object.assign(defaultGeofence, attributes);
  }

  clone(geofence: Geofence) {
    return JSON.parse(JSON.stringify(geofence));
  }

  addOrUpdate(geofence: Geofence) {
    return window.geofence.addOrUpdate(geofence).then(() => {
      var found = this.findById(geofence.id);

      if (!found) {
        this.geofences.push(geofence);
      } else {
        const index = this.geofences.indexOf(found);

        this.geofences[index] = geofence;
      }
    });
  }

  findAll() {
    return window.geofence.getWatched()
      .then((geofences) => {
        this.geofences = geofences;
        return geofences;
      });
  }

  findById(id) {
    return this.findAll()
      .then((geofences) => {
        const found = geofences.filter(g => g.id === id);

        if (found.length > 0) {
          return found[0];
        }

        return undefined;
      });
  }

  removeAll() {
    return window.geofence.removeAll().then(() => {
      this.geofences.clear();
    });
  }

  private generateId() {
    var d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);

      return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  private getNextNotificationId() {
    var max = 0;

    this.geofences.forEach(function (gf) {
      if (gf.notification && gf.notification.id) {
        if (gf.notification.id > max) {
          max = gf.notification.id;
        }
      }
    });

    return max + 1;
  }
}
