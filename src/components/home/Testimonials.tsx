import { AnimatedTestimonials } from "../animated-testimonials";

export default function Testimonials() {
    const testimonials = [
        {
            quote:
                "Finding and booking events has never been easier! The platform's user-friendly interface and diverse event selection have completely transformed how I plan my entertainment.",
            name: "Sarah Chen",
            designation: "Marketing Director at EventPro",
            src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            quote:
                "As someone who attends multiple events each month, this ticket booking platform is a game-changer. The seamless booking process and detailed event information save me so much time.",
            name: "Michael Rodriguez",
            designation: "Freelance Event Enthusiast",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            quote:
                "I love how I can discover local events across different events. The personalized recommendations have introduced me to amazing experiences I would have never found otherwise.",
            name: "Emily Watson",
            designation: "Community Event Coordinator",
            src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            quote:
                "The mobile app is incredibly convenient. I can browse, book, and manage all my event tickets from my phone without any hassle. Customer support is also top-notch!",
            name: "James Kim",
            designation: "Tech Blogger",
            src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            quote:
                "As an event organizer, I appreciate how this platform helps me reach a wider audience. The ticket management and analytics tools are incredibly powerful and user-friendly.",
            name: "Lisa Thompson",
            designation: "Founder of Urban Events",
            src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];
    return <AnimatedTestimonials testimonials={testimonials} />;
}
