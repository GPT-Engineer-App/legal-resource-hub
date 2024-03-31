import { useState, useEffect } from "react";
import { Box, Heading, Text, VStack, HStack, Link, Input, Textarea, Button, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const API_URL = "https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/";
const API_KEY = "supersecret";

const Index = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Basic ${btoa(API_KEY + ":")}`,
      },
    });
    const keys = await response.json();
    const resourcesData = await Promise.all(
      keys.map(async (key) => {
        const res = await fetch(`${API_URL}${key}`, {
          headers: {
            Authorization: `Basic ${btoa(API_KEY + ":")}`,
          },
        });
        return res.json();
      }),
    );
    setResources(resourcesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resource = { title, description, url };
    await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    setTitle("");
    setDescription("");
    setUrl("");
    fetchResources();
    toast({
      title: "Resource added",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = async (key) => {
    await fetch(`${API_URL}${key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(API_KEY + ":")}`,
      },
    });
    fetchResources();
    toast({
      title: "Resource deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEdit = async (key, updatedResource) => {
    await fetch(`${API_URL}${key}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${btoa(API_KEY + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedResource),
    });
    fetchResources();
    toast({
      title: "Resource updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="800px" margin="auto" padding={8}>
      <Heading as="h1" size="2xl" textAlign="center" marginBottom={8}>
        Recursive Legal
      </Heading>
      <Text fontSize="xl" textAlign="center" marginBottom={12}>
        Self-improving legal advice for exponential startups
      </Text>

      <VStack spacing={8} alignItems="stretch">
        {resources.map((resource, index) => (
          <Box key={index} borderWidth={1} borderRadius="lg" padding={4}>
            <HStack justifyContent="space-between">
              <Link href={resource.url} isExternal>
                <Heading as="h2" size="lg">
                  {resource.title}
                </Heading>
              </Link>
              <HStack>
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Edit resource"
                  onClick={() =>
                    handleEdit(resource.key, {
                      title: prompt("Enter new title", resource.title),
                      description: prompt("Enter new description", resource.description),
                      url: prompt("Enter new URL", resource.url),
                    })
                  }
                />
                <IconButton icon={<FaTrash />} aria-label="Delete resource" onClick={() => handleDelete(resource.key)} />
              </HStack>
            </HStack>
            <Text>{resource.description}</Text>
          </Box>
        ))}
      </VStack>

      <Box as="form" onSubmit={handleSubmit} marginTop={12}>
        <Heading as="h2" size="xl" marginBottom={4}>
          Add a new resource
        </Heading>
        <VStack spacing={4}>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <Button type="submit" leftIcon={<FaPlus />} colorScheme="blue">
            Add Resource
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Index;
