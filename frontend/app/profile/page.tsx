"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import UserSidebar from "@/components/UserSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/MultiSelect";
import tagOptions from "@/utils/tags";

function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone_number: "",
    tags: [] as string[],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // New state for fetching
  const [errors, setErrors] = useState({
    name: "",
    phone_number: "",
    tags: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true); // Set fetching to true when starting
    const client = createClient();
    const session = await client.auth.getUser();
    const token = session.data?.user?.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/dashboard/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setProfile(data);
    setIsFetching(false); // Set fetching to false when done
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", phone_number: "", tags: "" };

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (
      profile.phone_number &&
      !/^\+?[1-9]\d{1,14}$/.test(profile.phone_number)
    ) {
      newErrors.phone_number = "Invalid phone number format";
      isValid = false;
    }

    if (profile.tags.length === 0) {
      newErrors.tags = "Please select at least one tag";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const client = createClient();
    const session = await client.auth.getUser();
    const token = session.data?.user?.id;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/dashboard/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tags: profile.tags.join(","),
            phone_number: profile.phone_number,
            name: profile.name,
          }),
        }
      );

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <UserSidebar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-white text-2xl mb-4 font-bold">User Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-gray-400 block mb-2">Email</label>
              <Input
                value={profile.email}
                disabled
                className="bg-black text-gray-300"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 block mb-2">Name</label>
              <Input
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!isEditing}
                className="bg-black text-gray-300"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-gray-400 block mb-2">Phone Number</label>
              <Input
                value={profile.phone_number || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
                disabled={!isEditing}
                className="bg-black text-gray-300"
              />
              {errors.phone_number && (
                <p className="text-red-500 mt-1">{errors.phone_number}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-gray-400 block mb-2">Tags</label>
              <MultiSelect
                options={tagOptions}
                selected={profile.tags}
                onChange={(tags) => setProfile({ ...profile, tags })}
                placeholder="Select tags"
                className="bg-black text-gray-300"
              />
              {errors.tags && (
                <p className="text-red-500 mt-1">{errors.tags}</p>
              )}
            </div>
            {isEditing ? (
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-800 text-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-black"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full bg-white text-black"
              >
                Edit Profile
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
