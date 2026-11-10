import type { SacramentMeeting } from "./types";
import { addWeeks, getMostRecentSunday } from "./dates";

/**
 * Temporary in-memory data for Week 02.
 *
 * Dates are computed relative to the most recent Sunday so that
 * /meetings/current always resolves to a real record, no matter
 * when the app is run. Building the list per call (instead of once at
 * module load) keeps "this Sunday" correct on long-running servers.
 * A real database replaces this in a later week.
 */
function buildMeetings(): SacramentMeeting[] {
  const thisSunday = getMostRecentSunday();

  return [
    {
      id: 7,
      date: addWeeks(thisSunday, 1),
      meetingType: "regular",
      presiding: "Bishop Thomas Reyes",
      conducting: "Brother Daniel Ortiz",
      announcements: [
        "Ward temple night on Thursday at 7:00 PM.",
        "Sign up for the Christmas service project in the foyer.",
      ],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Sister Hannah Brooks",
      wardBusiness: [
        {
          description:
            "Sustaining of Brother Luis Vega as ward mission leader.",
        },
      ],
      stakeBusiness: false,
      sacramentHymn: { number: 183, title: "In Humility, Our Savior" },
      speakers: [
        {
          name: "Sister Priya Nair",
          topic: "Gratitude in all seasons",
          type: "speaker",
        },
        {
          name: "Primary Children",
          topic: "I Am a Child of God",
          type: "musical-number",
        },
        {
          name: "Brother Marcus Lee",
          topic: "The Savior as our example",
          type: "speaker",
        },
      ],
      closingHymn: { number: 98, title: "I Know That My Redeemer Lives" },
      closingPrayer: "Brother Ethan Walsh",
    },
    {
      id: 6,
      date: thisSunday,
      meetingType: "regular",
      presiding: "Bishop Thomas Reyes",
      conducting: "Brother Daniel Ortiz",
      announcements: [
        "Youth activity Wednesday at 6:30 PM at the stake center.",
        "Food drive donations are being collected through the end of the month.",
        "Relief Society will meet in the Relief Society room after the block.",
      ],
      openingHymn: { number: 5, title: "High on the Mountain Top" },
      openingPrayer: "Brother Caleb Morris",
      wardBusiness: [
        { description: "Release of Sister Amy Collins as Primary pianist." },
        {
          description: "Sustaining of Sister Grace Tanaka as Primary pianist.",
        },
      ],
      stakeBusiness: false,
      sacramentHymn: { number: 193, title: "I Stand All Amazed" },
      speakers: [
        {
          name: "Brother Owen Fischer",
          topic: "Finding peace through repentance",
          type: "speaker",
        },
        {
          name: "Ward Choir",
          topic: "Come, Thou Fount of Every Blessing",
          type: "musical-number",
        },
        {
          name: "Sister Elena Cruz",
          topic: "Strengthening families",
          type: "speaker",
        },
      ],
      closingHymn: { number: 85, title: "How Firm a Foundation" },
      closingPrayer: "Sister Olivia Grant",
    },
    {
      id: 5,
      date: addWeeks(thisSunday, -1),
      meetingType: "testimony",
      presiding: "Bishop Thomas Reyes",
      conducting: "Brother Samuel Price",
      announcements: [
        "Fast offerings may be given through the app or by envelope.",
      ],
      openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
      openingPrayer: "Sister Naomi Hall",
      wardBusiness: [],
      stakeBusiness: false,
      sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
      speakers: [
        {
          name: "Youth Speaker: Lily Chen",
          topic: "My testimony of the Book of Mormon",
          type: "speaker",
        },
        {
          name: "Open pulpit",
          topic: "Bearing of testimonies",
          type: "speaker",
        },
      ],
      closingHymn: { number: 70, title: "Let Us All Press On" },
      closingPrayer: "Brother Jacob Stone",
    },
    {
      id: 4,
      date: addWeeks(thisSunday, -2),
      meetingType: "regular",
      presiding: "Brother Adrian Silva (First Counselor)",
      conducting: "Brother Adrian Silva",
      announcements: [
        "Ward family history class begins next Sunday.",
        "Please remember to silence phones during the meeting.",
      ],
      openingHymn: { number: 1, title: "The Morning Breaks" },
      openingPrayer: "Brother Nolan Reid",
      wardBusiness: [
        {
          description:
            "Sustaining of Brother Kevin Doyle as elders quorum secretary.",
        },
      ],
      stakeBusiness: false,
      sacramentHymn: { number: 172, title: "In Memory of the Crucified" },
      speakers: [
        {
          name: "Sister Marisol Vega",
          topic: "Hope in Jesus Christ",
          type: "speaker",
        },
        {
          name: "Brother and Sister Patel",
          topic: "Because I Have Been Given Much (duet)",
          type: "musical-number",
        },
        {
          name: "Brother Noah Kim",
          topic: "Serving one another",
          type: "speaker",
        },
      ],
      closingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
      closingPrayer: "Sister Ruth Ellis",
    },
    {
      id: 3,
      date: addWeeks(thisSunday, -3),
      meetingType: "general",
      presiding: "Bishop Thomas Reyes",
      conducting: "Bishop Thomas Reyes",
      announcements: [
        "General conference broadcast; no sacrament meeting this week.",
      ],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Assigned by the general conference broadcast",
      wardBusiness: [],
      stakeBusiness: false,
      sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
      speakers: [],
      closingHymn: { number: 3, title: "Now Let Us Rejoice" },
      closingPrayer: "Assigned by the general conference broadcast",
    },
    {
      id: 2,
      date: addWeeks(thisSunday, -4),
      meetingType: "regular",
      presiding: "Bishop Thomas Reyes",
      conducting: "Brother Daniel Ortiz",
      announcements: [
        "Ward campout sign-up closes this Friday.",
        "New members: please see the bishop’s secretary for a welcome packet.",
      ],
      openingHymn: { number: 4, title: "Praise to the Lord, the Almighty" },
      openingPrayer: "Brother Isaac Dunn",
      wardBusiness: [
        { description: "Release of Brother Paul Hayes as ward clerk." },
      ],
      stakeBusiness: true,
      sacramentHymn: { number: 181, title: "Jesus, Once of Humble Birth" },
      speakers: [
        {
          name: "Sister Beth Anderson",
          topic: "The power of daily scripture study",
          type: "speaker",
        },
        {
          name: "Sister Carla Mendes",
          topic: "Be Still, My Soul (violin solo)",
          type: "musical-number",
        },
        {
          name: "Brother Henry Cole",
          topic: "Ministering with love",
          type: "speaker",
        },
      ],
      closingHymn: { number: 129, title: "Be Thou Humble" },
      closingPrayer: "Sister Mia Jensen",
    },
    {
      id: 1,
      date: addWeeks(thisSunday, -5),
      meetingType: "stake",
      presiding: "President Lawrence Webb (Stake Presidency)",
      conducting: "Brother Gareth Hill (Stake Executive Secretary)",
      announcements: [
        "Stake conference: no ward sacrament meeting is held today.",
      ],
      openingHymn: { number: 1, title: "The Morning Breaks" },
      openingPrayer: "Assigned by the stake presidency",
      wardBusiness: [],
      stakeBusiness: true,
      sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
      speakers: [
        {
          name: "Stake Choir",
          topic: "Redeemer of Israel",
          type: "musical-number",
        },
        {
          name: "President Lawrence Webb",
          topic: "Gathering Israel on both sides of the veil",
          type: "speaker",
        },
      ],
      closingHymn: { number: 2, title: "The Spirit of God" },
      closingPrayer: "Assigned by the stake presidency",
    },
  ];
}

/**
 * Return all meetings, newest first.
 * When `date` ('YYYY-MM-DD') is given, only meetings on that date are returned.
 */
export function getMeetings(date?: string): SacramentMeeting[] {
  const sorted = buildMeetings().sort((a, b) => b.date.localeCompare(a.date));
  return date ? sorted.filter((m) => m.date === date) : sorted;
}

/** Return a single meeting by numeric id, or undefined when none exists. */
export function getMeetingById(id: number): SacramentMeeting | undefined {
  return buildMeetings().find((m) => m.id === id);
}
