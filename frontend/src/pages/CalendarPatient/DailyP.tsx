import { Box, Typography, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircularProgress } from "@mui/material";
import { formatDate, formatTimeTo12Hour } from '../../utils/DatesUtils';
import { AppointmentStatusKey, appointmentStatusMap, mapEstadoToAppointmentStatusKey } from '../../utils/AppointmentStatus';

const timeSlots = ['08 AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM'];

const generateDaysAround = (center: Date) => {
    const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    const result = [];

    for (let offset = -3; offset <= 3; offset++) {
        const date = new Date(center);
        date.setDate(center.getDate() + offset);

        const isToday = new Date().toDateString() === date.toDateString();

        result.push({
            label: isToday ? 'HOY' : daysOfWeek[date.getDay()],
            date: date.getDate(),
            fullDate: new Date(date), // para actualizaciones
            isToday,
        });
    }

    return result;
};

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();



const hourHeight = 150; // altura por hora en px
const parseTimeToFloat = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
};


interface MyProps {
    handleOpen: any;
    loading: boolean;
    events: any[];
    setDateRange: (range: { start: string; end: string }) => void;
}

const Daily: React.FC<MyProps> = ({ handleOpen, loading, events, setDateRange }) => {
    const [centerDate, setCenterDate] = useState(new Date());
    const days = generateDaysAround(centerDate);

    useEffect(() => {
        const start = new Date(centerDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(centerDate);
        end.setHours(23, 59, 59, 999);

        setDateRange({
            start: formatDate(start),
            end: formatDate(end),
        });
    }, [centerDate]);

    const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const filteredEvents = events
        .filter(ev => {
            const evDate = parseLocalDate(ev.fecha);
            return isSameDay(evDate, centerDate);
        })
        .map(ev => {
            return {
                // convertir hora_inicio y hora_fin a formato AM/PM
                timeRange: `${formatTimeTo12Hour(ev.hora_inicio)} - ${formatTimeTo12Hour(ev.hora_fin)}`,
                title: ev.motivo || ev.nombre_tratamiento || "Sin título",
                person: ev.nombre_doctor,
                status: ev.estado,
                type: mapEstadoToAppointmentStatusKey(ev.estado),
                data: ev
            };
        });

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, mt: 2 }}>
                {Object.entries(appointmentStatusMap).map(([key, { label, color }]) => (
                    <Chip
                        key={key}
                        label={label}
                        sx={{ backgroundColor: color, color: '#333' }}
                    />
                ))}
            </Box>

            <Box sx={{
                display: 'flex', justifyContent: 'center', borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc', maxWidth: '100dvw', mt: 3, overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}>
                <Box
                    onClick={() => setCenterDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1))}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', mr: -2 }}
                >
                    <ArrowBackIosIcon fontSize="small" />
                </Box>
                {days.map((day, index) => (
                    <Box
                        onClick={() => setCenterDate(day.fullDate)}
                        key={index}
                        sx={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            p: 1,
                            minWidth: { xs: 70, sm: 90 },
                            borderBottom: day.fullDate.toDateString() === centerDate.toDateString()
                                ? '2px solid black'
                                : undefined,
                        }}
                    >
                        {
                            day.isToday ? (null) :
                                (<Typography variant="caption" color="text.secondary">
                                    {day.label}
                                </Typography>)
                        }

                        <Typography variant="body2" fontWeight={day.isToday ? 'bold' : 'normal'}>
                            {day.isToday ? (
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'inline-block',
                                        px: 1.5,
                                        py: 1.0,
                                        borderRadius: 1,
                                        bgcolor: '#D3D3D3',
                                        mt: 0.5,
                                    }}
                                >
                                    HOY
                                </Box>
                            ) : (
                                day.date
                            )}
                        </Typography>
                    </Box>
                ))}
                <Box
                    onClick={() => setCenterDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', ml: -2 }}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </Box>
            </Box>


            <Box sx={{ display: 'flex', mt: 3, px: 2 }}>
                {/* Columna de horas */}
                <Box sx={{ width: 80 }}>
                    {timeSlots.map((time) => (
                        <Box key={time} height={hourHeight} display="flex" alignItems="flex-start">
                            <Typography variant="body2" color="text.secondary">
                                {time}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Área de eventos */}
                <Box position="relative" flex={1} height={timeSlots.length * hourHeight} sx={{ display: isSameDay(centerDate, new Date()) ? "block" : "block", overflow: "hidden"}}>
                    {filteredEvents.map((event, index) => {
                        const [startStr, endStr] = event.timeRange.split(' - ');
                        const start = parseTimeToFloat(startStr);
                        const end = parseTimeToFloat(endStr);
                        const top = (start - 8) * hourHeight;
                        const height = (end - start) * hourHeight;
                        const status = appointmentStatusMap[event.type as AppointmentStatusKey];

                        return (
                            <Box
                                onClick={() => handleOpen(true, event.data)}
                                sx={{
                                    position: "absolute",
                                    top: top,
                                    left: 0,
                                    right: 0,
                                    height: height - 16,
                                    p: 2,
                                    mt: 2,
                                    bgcolor: status.color,
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column', // móviles (portrait)
                                        sm: 'row',     //
                                    },
                                    alignItems: {
                                        xs: 'flex-start',
                                        sm: 'center',
                                    },
                                    cursor: 'pointer',

                                    /* minHeight:hourHeight-10, */
                                    /* boxShadow:1 */
                                }}
                                key={index}


                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.person ? `${event.person} -` : ''} {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.timeRange}
                                    </Typography>
                                </Box>

                                {/* <Chip
                                    size="small"
                                    label={status.label}
                                    color={status.color as any}
                                    sx={{ mt: 1 }}
                                /> */}
                            </Box>
                        );
                    })}

                    {
                        loading &&
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    }
                </Box>
            </Box>
        </>

    );
};

export default Daily;
