import React from 'react';
import { eventsData, GREGORIAN_MONTHS, CalendarEvent } from '../events';
import { PrintIcon } from './Icons';

const EventTypeStyles = {
    yemeni: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    international: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    educational: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
};

const EventTypeNames = {
    yemeni: 'مناسبة يمنية',
    international: 'مناسبة عالمية',
    educational: 'مناسبة تربوية',
};

const EventsView: React.FC = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    const upcomingEvents = eventsData
        .filter(event => {
            const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
            return (event.month === currentMonth && event.day >= currentDay) || event.month === nextMonth;
        })
        .sort((a, b) => {
            if (a.month !== b.month) return a.month - b.month;
            return a.day - b.day;
        });
    
    const eventsByMonth = GREGORIAN_MONTHS.map((monthName, index) => {
        const monthNumber = index + 1;
        return {
            monthName,
            events: eventsData.filter(e => e.month === monthNumber).sort((a, b) => a.day - b.day),
        };
    }).filter(month => month.events.length > 0);

    const handlePrint = () => {
        window.print();
    };
    
    const EventCard: React.FC<{ event: CalendarEvent }> = ({ event }) => {
        const styles = EventTypeStyles[event.type];
        return (
            <div className={`p-4 rounded-lg flex items-start space-x-4 space-x-reverse ${styles.bg} border-r-4 ${styles.border} break-inside-avoid`}>
                <div className="flex-shrink-0 text-center">
                    <p className={`text-3xl font-bold ${styles.text}`}>{event.day}</p>
                    <p className="text-sm text-gray-600">{GREGORIAN_MONTHS[event.month - 1]}</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">{event.name}</h4>
                    <p className={`text-sm font-semibold ${styles.text}`}>{EventTypeNames[event.type]}</p>
                    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div id="report-view" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <div className="no-print flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                    المناسبات والفعاليات
                </h2>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 space-x-reverse"
                >
                    <PrintIcon />
                    <span>طباعة</span>
                </button>
            </div>
             <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 print:block hidden">
                المناسبات والفعاليات
            </h2>

            <section className="mb-10 break-inside-avoid">
                <h3 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">تذكير: مناسبات قادمة</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingEvents.map(event => (
                            <EventCard key={`${event.month}-${event.day}`} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-600">لا توجد مناسبات قادمة خلال الشهرين الحالي والقادم.</p>
                    </div>
                )}
            </section>

            <section className="break-inside-avoid">
                <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">تقويم العام</h3>
                <div className="space-y-6">
                    {eventsByMonth.map(({ monthName, events }) => (
                        <div key={monthName} className="break-inside-avoid">
                            <h4 className="text-lg font-semibold bg-gray-100 p-2 rounded-md mb-3">{monthName}</h4>
                            <ul className="space-y-2">
                                {events.map(event => (
                                    <li key={`${event.day}-${event.name}`} className="flex items-start space-x-4 space-x-reverse ml-4 p-2 rounded-md hover:bg-gray-50">
                                        <span className={`w-20 text-center pt-1 flex-shrink-0 font-bold ${EventTypeStyles[event.type].text}`}>{event.day} {monthName}</span>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-800 font-semibold">{event.name}</span>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${EventTypeStyles[event.type].bg} ${EventTypeStyles[event.type].text}`}>
                                                    {EventTypeNames[event.type]}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default EventsView;