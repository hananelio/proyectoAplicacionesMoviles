import { Encuesta } from '../../models/encuesta.model';
import { DateTime } from 'luxon';

export class FirestoreMapear {
    static toTimestamp(dateStr?: string) {
        return dateStr ? DateTime.fromISO(dateStr).toISO(): undefined;
    }

    static fromTimestamp(timestamp?: string) {
        return timestamp ? DateTime.fromISO(timestamp).toISO() : '';
    }

    static encuestaToFirestore(e : Encuesta) {
        //const toTimestamp = (d : any) => new Date(d).toISOString();
        const fields : any = {
            titulo : { stringValue : e.titulo },
            creadorId : { stringValue : e.creadorId },
            estado : { stringValue : e.estado },
            descripcion : { stringValue : e.descripcion ?? '' },
            //if (e.fechaCreacion) fields.fechaCreacion = { timestampValue : e.fechaCreacion };
            //if (e.fechaCreacion) fields.fechaCreacion = { timestampValue : this.toTimestamp(e.fechaCreacion) ?? '' }

            /*fechaCreacion: { timestampValue: this.toTimestamp(e.fechaCreacion)! },
            fechaActualizacion: { timestampValue: this.toTimestamp(e.fechaActualizacion ?? e.fechaCreacion)! },
            fechaPublicacion: { timestampValue: e.fechaPublicacion ? this.toTimestamp(e.fechaPublicacion)! : null },
            fechaCierre: { timestampValue: e.fechaCierre ? this.toTimestamp(e.fechaCierre)! : null }*/
        };

        if (e.fechaCreacion) fields.fechaCreacion = { timestampValue: this.toTimestamp(e.fechaCreacion) };
        if (e.fechaActualizacion) fields.fechaActualizacion = { timestampValue: this.toTimestamp(e.fechaActualizacion) };
        if (e.fechaPublicacion) fields.fechaPublicacion = { timestampValue: this.toTimestamp(e.fechaPublicacion) };
        if (e.fechaCierre) fields.fechaCierre = { timestampValue: this.toTimestamp(e.fechaCierre) };

        return { fields };
    }

    static encuestaFromFirestore(doc: any): Encuesta {
        const f = doc.fields ?? {};
        return {
            id: doc.name?.split('/').pop() ?? '',
            titulo: f.titulo?.stringValue ?? '',
            descripcion: f.descripcion?.stringValue ?? '',
            creadorId: f.creadorId?.stringValue ?? '',
            estado: f.estado?.stringValue ?? 'borrador',
            //fechaCreacion: f.fechaCreacion?.timestampValue ?? undefined,
            //fechaCreacion: f.fechaCreacion?.timestampValue,
            //fechaCreacion: this.fromTimestamp(f.fechaCreacion?.timestampValue) ?? '',
            fechaCreacion: this.fromTimestamp(f.fechaCreacion?.timestampValue) ?? '',
            fechaActualizacion: this.fromTimestamp(f.fechaActualizacion?.timestampValue) ?? '',
            fechaPublicacion: this.fromTimestamp(f.fechaPublicacion?.timestampValue) ?? '',
            fechaCierre: this.fromTimestamp(f.fechaCierre?.timestampValue) ?? '',
            
            secciones: [], // se llenará si haces otra petición a subcolección
            asignaciones: [],
        }
    }
}
