// Default mock seed data for all app modules

export const DEFAULT_MEMBERS = [
  { id: '1', name: 'Marcus Aurelius', email: 'marcus@stoic.org', phone: '+1 555-0100', tier: 'VIP', status: 'Active', joinedDate: '2025-01-15', lastCheckIn: 'Today, 08:30 AM' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@cyberdyne.com', phone: '+1 555-0199', tier: 'Standard', status: 'Active', joinedDate: '2025-03-22', lastCheckIn: 'Yesterday, 05:14 PM' },
  { id: '3', name: 'John Doe', email: 'john@gmail.com', phone: '+1 555-0144', tier: 'Basic', status: 'Expiring', joinedDate: '2025-05-10', lastCheckIn: '2 days ago' },
  { id: '4', name: 'Ellen Ripley', email: 'ripley@weyland.com', phone: '+1 555-0321', tier: 'VIP', status: 'Inactive', joinedDate: '2024-11-05', lastCheckIn: '3 weeks ago' }
];

export const DEFAULT_CLASSES = [
  { id: '1', name: 'HIIT Fire Intensity', instructor: 'Coach Rex', day: 'Monday', time: '07:30 AM', duration: '45 mins', capacity: 15, enrolled: 12, isBooked: false },
  { id: '2', name: 'Power Weight Lifting', instructor: 'Alex Mercer', day: 'Monday', time: '06:00 PM', duration: '60 mins', capacity: 12, enrolled: 8, isBooked: false },
  { id: '3', name: 'Vinyasa Flow Yoga', instructor: 'Elena Rostova', day: 'Tuesday', time: '08:00 AM', duration: '60 mins', capacity: 20, enrolled: 18, isBooked: false },
  { id: '4', name: 'Core Crusher 360', instructor: 'Coach Rex', day: 'Wednesday', time: '09:00 AM', duration: '30 mins', capacity: 25, enrolled: 10, isBooked: false },
  { id: '5', name: 'Barbell Strength A', instructor: 'Alex Mercer', day: 'Thursday', time: '05:30 PM', duration: '60 mins', capacity: 15, enrolled: 15, isBooked: false },
  { id: '6', name: 'Cardio Kickboxing', instructor: 'Jessica Miller', day: 'Friday', time: '08:00 AM', duration: '45 mins', capacity: 20, enrolled: 14, isBooked: false },
  { id: '7', name: 'Sunday Recovery Stretch', instructor: 'Elena Rostova', day: 'Sunday', time: '10:00 AM', duration: '60 mins', capacity: 30, enrolled: 22, isBooked: false }
];

export const DEFAULT_ROUTINES = [
  {
    id: '1',
    name: 'Full Body Power Prep',
    category: 'Strength',
    description: 'Strength base targeting major compound groups.',
    exercises: [
      { name: 'Goblet Squats', sets: '3 sets x 12 reps' },
      { name: 'Push-Ups (weighted/normal)', sets: '3 sets x 15 reps' },
      { name: 'Dumbbell Romanian Deadlifts', sets: '3 sets x 10 reps' },
      { name: 'Plank Hold', sets: '3 sets x 60 secs' }
    ]
  },
  {
    id: '2',
    name: 'HIIT Cardio Blaster',
    category: 'Cardio',
    description: 'High rate anaerobic circuit to burn calories.',
    exercises: [
      { name: 'Burpees', sets: '4 sets x 45 secs' },
      { name: 'Mountain Climbers', sets: '4 sets x 40 secs' },
      { name: 'Kettlebell Swings', sets: '4 sets x 20 reps' },
      { name: 'Jumping Jacks', sets: '4 sets x 60 secs' }
    ]
  }
];

export const DEFAULT_LOGS = [
  { id: '1', routineName: 'Full Body Power Prep', duration: '42:15', date: 'Jun 1, 2026' },
  { id: '2', routineName: 'HIIT Cardio Blaster', duration: '28:40', date: 'May 30, 2026' }
];

export const DEFAULT_SETTINGS = {
  gymName: 'Apex Fitness',
  operatingHours: '06:00 AM - 10:00 PM',
  supportContact: '+1 (555) 012-3456',
  enableOfflineCaching: true,
  enableBackgroundSync: true
};

export const DEFAULT_CHECKINS = [
  { id: 'c1', memberName: 'Marcus Aurelius', time: 'Today, 08:30 AM', tier: 'VIP', status: 'Active' },
  { id: 'c2', memberName: 'Sarah Connor', time: 'Yesterday, 05:14 PM', tier: 'Standard', status: 'Active' }
];
