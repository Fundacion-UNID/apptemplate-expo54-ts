// demo/connections.data.js

export const demoConnectionsList = [
{
    id: 'conn-1',
    kind: 'professional',
    groupName: 'Family Doctor',
    profileImage: 'https://placehold.co/100x100/A8D5E2/333333?text=FD',
    badge: { type: 'info', visible: true, content: 'NEW' },
    lastAction: {
    type: 'message_received',
    sender: 'Dr. Smith',
    date: '2026-09-01',
    time: '10:00',
    iconName: 'sms',
    iconType: 'material',
    },
},
{
    id: 'conn-2',
    kind: 'professional',
    groupName: 'Clinic Specialist',
    profileImage: 'https://placehold.co/100x100/E2A8D5/333333?text=CS',
    badge: { type: 'warning', visible: true, content: '1' },
    lastAction: {
    type: 'index_updated',
    section: 'results',
    sender: 'System',
    date: '2026-08-30',
    time: '15:20',
    iconName: 'update',
    iconType: 'material',
    },
},
{
    id: 'conn-3',
    kind: 'professional',
    groupName: 'Physiotherapist',
    profileImage: 'https://placehold.co/100x100/D5E2A8/333333?text=PT',
    badge: { visible: false },
    lastAction: {
    type: 'message_sent',
    sender: 'You',
    date: '2026-08-28',
    time: '11:45',
    iconName: 'send',
    iconType: 'material',
    },
},
{
    id: 'conn-4',
    kind: 'professional',
    groupName: 'ClinicaLabs',
    profileImage: 'https://placehold.co/100x100/E2D5A8/333333?text=CL',
    badge: { type: 'info', visible: true, content: 'PDF' },
    lastAction: {
    type: 'notification',
    section: 'Lab Results',
    sender: 'System',
    date: '2026-09-02',
    time: '08:30',
    iconName: 'attach-file',
    iconType: 'material',
    },
},
];

export const mockChatMessages = {
  'fam-1': [ // Family Health
    {
      _id: 1,
      translationKey: 'fam-1.1',
      createdAt: new Date(Date.now() - 60000 * 5),
      user: { _id: 2, nameKey: 'mom', avatar: 'https://i.pravatar.cc/150?img=11' },
    },
    {
      _id: 2,
      translationKey: 'fam-1.2',
      createdAt: new Date(Date.now() - 60000 * 2),
      user: { _id: 1, nameKey: 'you' },
    },
     {
      _id: 3,
      translationKey: 'fam-1.3',
      createdAt: new Date(),
      user: { _id: 2, nameKey: 'mom', avatar: 'https://i.pravatar.cc/150?img=11' },
    },
  ],
  'conn-1': [ // Family Doctor
    {
      _id: 1,
      translationKey: 'conn-1.1',
      createdAt: new Date(),
      user: { _id: 2, nameKey: 'drSmith', avatar: 'https://placehold.co/100x100/A8D5E2/333333?text=FD' },
    },
  ],
  'conn-2': [ // Clinic Specialist
    {
      _id: 1,
      translationKey: 'conn-2.1',
      createdAt: new Date(),
      user: { _id: 2, nameKey: 'clinicSpecialist', avatar: 'https://placehold.co/100x100/E2A8D5/333333?text=CS' },
    },
  ],
  'conn-3': [ // Physiotherapist
    {
      _id: 1,
      translationKey: 'conn-3.1',
      createdAt: new Date(),
      user: { _id: 2, nameKey: 'physiotherapist', avatar: 'https://placehold.co/100x100/D5E2A8/333333?text=PT' },
    },
  ],
  'conn-4': [ // ClinicaLabs
    {
      _id: 1,
      translationKey: 'conn-4.1',
      createdAt: new Date(),
      user: { _id: 2, nameKey: 'clinicaLabs', avatar: 'https://placehold.co/100x100/E2D5A8/333333?text=CL' },
    },
  ],
};
