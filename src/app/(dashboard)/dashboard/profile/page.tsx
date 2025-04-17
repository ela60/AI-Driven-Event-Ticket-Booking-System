"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BriefcaseBusiness,
  Delete,
  House,
  Mail,
  Phone,
  SquarePen,
  Upload,
  User,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Update schema to match the user properties from Prisma
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(1, "Contact is required"),
  profession: z.string(),
  about: z.string(),
  address: z.string(),
  image: z.instanceof(File).optional(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

// Extended User type based on your Prisma model
type ExtendedUserType = {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: "USER" | "ADMIN" | "ORGANIZER";
  contact?: string;
  profession?: string;
  about?: string;
  address?: string;
};

const Profile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<ExtendedUserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toggle, setToggle] = useState(true);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    // Use the session data instead of simulated data
    if (status === "authenticated" && session?.user) {
      // Fetch additional user details if needed
      const fetchUserDetails = async () => {
        try {
          const response = await fetch("/api/users/profile");
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setImagePreview(userData.image || "/images/default-avatar.png");

            // Set form default values after fetching user data
            form.reset({
              name: userData.name || "",
              email: userData.email,
              contact: userData.contact || "",
              profession: userData.profession || "",
              about: userData.about || "",
              address: userData.address || "",
            });
          } else {
            // Fallback to session data if API fails
            const sessionUser = session.user as ExtendedUserType;
            setUser(sessionUser);
            setImagePreview(sessionUser.image || "/images/default-avatar.png");
            
            form.reset({
              name: sessionUser.name || "",
              email: sessionUser.email,
              contact: sessionUser.contact || "",
              profession: sessionUser.profession || "",
              about: sessionUser.about || "",
              address: sessionUser.address || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data");
        }
      };

      fetchUserDetails();
    }
  }, [session, status, form]);

  // Show loading state while session is loading
  if (status === "loading") {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  // If not authenticated, show message
  if (status === "unauthenticated") {
    return <div className="flex justify-center items-center h-96">Please sign in to view your profile</div>;
  }

  // Add null checks for user in the render section
  if (!user) {
    return <div className="flex justify-center items-center h-96">Loading profile data...</div>;
  }

  const onSubmit = async (data: UpdateProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setToggle(true);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500 hover:bg-red-600";
      case "ORGANIZER":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };

  return (
    <div className='w-full p-6 flex flex-col lg:flex-row gap-6'>
      <Card className='w-full lg:w-1/3 border-none shadow-none'>
        <CardContent className='p-0 '>
          <div className='relative'>
            <Image
              src='/image/cybersecurity.jpg'
              alt='banner image'
              width={500}
              height={160}
              objectFit='cover'
              className='h-40 rounded-t object-cover'
            />
            <Image
              src={imagePreview || user.image || "/images/default-avatar.png"}
              alt={user.name || "User"}
              width={144}
              height={144}
              className='w-36 h-36 rounded-full absolute -bottom-10 border-2 border-[var(--color-primary)] left-2 right-0 object-cover'
            />
          </div>
          <div className='mt-12 px-4 pb-4 space-y-1'>
            <div className="flex items-center gap-2">
              <h2 className='text-2xl sm:text-3xl font-semibold '>
                {user.name}
              </h2>
              <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                {user.role}
              </Badge>
            </div>
            <div className='text-lg font-semibold flex gap-2 items-center'>
              <Mail />
              {user.email}
            </div>
            <div className='text-lg font-semibold flex gap-2 items-center'>
              <Phone />
              {user.contact || "Not provided"}
            </div>
            <div className='text-lg font-semibold flex gap-2 items-center'>
              <House />
              {user.address || "Not provided"}
            </div>
            <div className='text-lg font-semibold flex gap-2 items-center'>
              <BriefcaseBusiness />
              <p className='break-words w-full '>{user.profession || "Not specified"}</p>
            </div>
            <hr />
            <div className='text-base'>{user.about || "No description provided."}</div>
          </div>
        </CardContent>
      </Card>
      <div className='border-none shadow-md bg-secondary w-full lg:w-2/3 rounded-md '>
        <div className='flex gap-6 justify-between items-center p-4 border-b-2 border-dashed border-gray-400'>
          <h1 className='text-xl font-semibold'>My Profile</h1>
          <div onClick={() => setToggle(!toggle)}>
            {toggle ? <SquarePen /> : <Delete />}
          </div>
        </div>
        {toggle ? (
          <div className='grid grid-cols-2 gap-4 p-4 text-base sm:text-lg'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <User />
                Full Name
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                {user.name || "Not set"}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Mail />
                Email
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                {user.email}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Phone />
                Contact
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                {user.contact || "Not provided"}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <House />
                Address
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                {user.address || "Not provided"}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <BriefcaseBusiness />
                Profession
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                {user.profession || "Not specified"}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <ShieldCheck />
                Role
              </div>
              <div className='bg-background rounded-md py-1 px-3 break-words'>
                <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className='p-4 text-base sm:text-lg'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <input
                            type='text'
                            {...field}
                            className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <input
                            disabled
                            type='email'
                            {...field}
                            className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='contact'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                          <input
                            type='text'
                            {...field}
                            className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <input
                            type='text'
                            {...field}
                            className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='profession'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <input
                            type='text'
                            {...field}
                            className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <ShieldCheck />
                      Role
                    </div>
                    <div className='bg-background rounded-md py-1 px-3 break-words'>
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                        {user.role}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Role cannot be changed by the user</p>
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name='about'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className='block w-full border border-gray-300 text-black rounded-md py-1 pl-3 shadow-sm'
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='image'
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <div
                          className='border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer'
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                        >
                          {imagePreview ? (
                            <Image
                              src={imagePreview as string}
                              width={144}
                              height={144}
                              alt='Profile Preview'
                              className='rounded-full w-36 h-36 object-cover'
                            />
                          ) : (
                            <Upload className='h-8 w-8 text-muted-foreground mb-2' />
                          )}
                          <Input
                            id='image'
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handleImageChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='w-full'>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full mt-4'
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 