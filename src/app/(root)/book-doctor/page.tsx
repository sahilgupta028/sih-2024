"use client";

// components/AppointmentForm.tsx
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Patient } from '@/models/Patient';
import { useToast } from '@/components/ui/use-toast';
import Hospital from '@/models/Hospital';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import CustomAppInput from '@/components/CustomAppInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const appointmentFormSchema = z.object({
  patientName: z.string().min(3),
  patientEmail: z.string().email(),
  patientPhoneNumber: z.string().optional(),
  patientAddress: z.string(),
  patientImage: z.string().optional(),
  patientAge: z.number().min(0).optional(),
  patientHeight: z.number().min(0).optional(),
  patientWeight: z.number().min(0).optional(),
  patientBloodGroup: z.string().optional(),
  patientAllergies: z.array(z.string()).optional(),
  patientMedications: z.array(z.string()).optional(),
  patientBodyImage: z.string().optional(),
  patientPrescriptionImage: z.string().optional(),
  patientDiseases: z.array(z.string()).optional(),
  hospitalName: z.string().min(3),
  hospitalId: z.string().min(3),
  clinicAddress: z.string().min(2).optional(),
  startTimestamp: z.string().optional(),
  endTimestamp: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

const AppointmentForm = () => {
  const { data: session } = useSession();
  const patient = session?.user;

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<Patient>();
  const [hospitalData, setHospitalData] = useState<Hospital>();
  const [allergies, setAllergies] = useState<string[]>(['']);
  const [medications, setMedications] = useState<string[]>(['']);
  const [diseases, setDiseases] = useState<string[]>(['']);

  const searchParams = useSearchParams();
  const hospitalId = searchParams.get('hospitalId');

  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: patient?.name,
      patientEmail: patient?.email || '',
      patientPhoneNumber: patient?.phoneNumber?.toString() || '',
      patientAddress: patientData?.address || '',
      patientImage: patientData?.image || '',
      patientAge: patientData?.age || 0,
      patientHeight: patientData?.height || 0,
      patientWeight: patientData?.weight || 0,
      patientBloodGroup: patientData?.bloodGroup || '',
      patientAllergies: [],
      patientMedications: [],
      patientBodyImage: patientData?.image || '',
      patientPrescriptionImage: '',
      patientDiseases: [],
      hospitalName: hospitalData?.name || '',
      hospitalId: hospitalId || '',
      clinicAddress: hospitalData?.clinicAddress || '',
      startTimestamp: Date.now().toString(),
      endTimestamp: Date.now().toString(),
    }
  });

  const fetchPatientDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      if (!patient?._id) {
        setError('An error occurred while fetching patient data: Patient not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/get-patient-by-id?id=${patient?._id}`);
      const responseJson = response.data;

      if (response.status !== 200 || response.data.error) {
        setError('An error occurred while fetching patient data: ' + response.data.error);
        toast({
          title: 'Error',
          description: 'An error ' + response.data.error,
          variant: 'destructive'
        });
        return;
      }

      const patientData = responseJson.data;
      setSuccess('Patient data fetched successfully: ' + patientData.name);
      setPatientData(patientData);

      // Update form default values with fetched patient data
      reset({
        patientName: patientData?.name || '',
        patientEmail: patientData?.email || '',
        patientPhoneNumber: patientData?.phoneNumber?.toString() || '',
        patientAddress: patientData?.address || '',
        patientImage: patientData?.image || '',
        patientAge: patientData?.age || 0,
        patientHeight: patientData?.height || 0,
        patientWeight: patientData?.weight || 0,
        patientBloodGroup: patientData?.bloodGroup || '',
        patientAllergies: patientData?.allergies || [''],
        patientMedications: patientData?.medications || [''],
        patientBodyImage: patientData?.image || '',
        patientPrescriptionImage: '',
        patientDiseases: patientData?.diseases || [''],
        hospitalName: hospitalData?.name || '',
        hospitalId: hospitalId || '',
        clinicAddress: hospitalData?.clinicAddress || '',
        startTimestamp: '',
        endTimestamp: '',
      });

    } catch (error) {
      setError('An error occurred while fetching patient data: ' + error);
      toast({
        title: 'Error',
        description: 'An error ' + error,
        variant: 'destructive'
      });
      return;
    } finally {
      setLoading(false);
    }
  }, [patient, toast, reset]);

  const fetchHospitalDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      if (!hospitalId) {
        setError('An error occurred while fetching hospital data: Hospital not found');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'An error ' + 'Hospital not found',
          variant: 'destructive'
        });
        return;
      }

      const response = await axios.get(`/api/get-hospital-by-id?id=${hospitalId}`);
      const responseJson = response.data;

      if (response.status !== 200) {
        setError('An error occurred while fetching hospital data: ' + responseJson.message);
        return;
      }

      const hospitalData = responseJson.data;

      toast({
        title: 'Success',
        description: 'Hospital data fetched successfully',
        variant: 'success'
      });

      setHospitalData(hospitalData);
      setSuccess('Hospital data fetched successfully: ' + hospitalData?.name);

      // Update form default values with fetched hospital data
      reset({
        hospitalName: hospitalData?.name || '',
        hospitalId: hospitalId || '',
        clinicAddress: hospitalData?.clinicAddress || '',
        // Include other fields if necessary
      });

    } catch (error) {
      setError('An error occurred while fetching hospital data: ' + error);
      toast({
        title: 'Error',
        description: 'An error ' + error,
        variant: 'destructive'
      });
      return;
    } finally {
      setLoading(false);
    }
  }, [hospitalId, reset, toast]);

  useEffect(() => {
    if (patient?._id) {
      fetchPatientDetails();
    }

    if (hospitalId) {
      fetchHospitalDetails();
    }

  }, [session, patient?._id, setPatientData, setHospitalData, hospitalId, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    console.log("data: ", data);

    toast({
      title: 'Info',
      description: 'Creating appointment',
      variant: 'default'
    });

    setLoading(true);

    try {
      if (!patient?._id) {
        setError('An error occurred while creating appointment: Patient not found');
        setLoading(false);
        toast(
          {
            title: 'Error',
            description: 'An error ' + 'Patient not found',
            variant: 'destructive'
          }
        );
        return;
      }

      const response = await axios.post(`/api/create-new-appointment?patientId=${patient?._id}&hospitalId=${hospitalId}`, data);

      const responseJson = response.data;

      if (response.status !== 201 || responseJson.status !== 201 || responseJson.error) {
        setError('An error occurred while creating appointment: ' + responseJson.message);
        toast(
          {
            title: 'Error',
            description: 'An error ' + responseJson.message,
            variant: 'destructive'
          }
        );
        return;
      }

      setSuccess('Appointment created successfully: ' + responseJson.data?.hospitalName);
      reset();

    } catch (error) {
      setError('An error occurred while creating appointment: ' + error);
      toast(
        {
          title: 'Error',
          description: 'An error ' + error,
          variant: 'destructive'
        }
      );
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAllergy = (index: number) => {
    const values = [...allergies];
    values.splice(index, 1);
    setAllergies(values);
  };

  const handleAddAllergy = () => {
    setAllergies([...allergies, '']);
  };

  const handleRemoveMedication = (index: number) => {
    const values = [...medications];
    values.splice(index, 1);
    setMedications(values);
  };

  const handleAddMedication = () => {
    setMedications([...medications, '']);
  };

  const handleRemoveDisease = (index: number) => {
    const values = [...diseases];
    values.splice(index, 1);
    setDiseases(values);
  };

  const handleAddDisease = () => {
    setDiseases([...diseases, '']);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <FormError message={error?.toString()} />
      <FormSuccess message={success} />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
        <CustomAppInput
          label="Patient Name"
          name="patientName"
          register={register}
          errors={errors.patientName}
        />
        <CustomAppInput
          label="Patient Email"
          name="patientEmail"
          register={register}
          errors={errors.patientEmail}
        />
        <CustomAppInput
          label="Patient Phone Number"
          name="patientPhoneNumber"
          register={register}
          errors={errors.patientPhoneNumber}
        />
        <CustomAppInput
          label="Patient Address"
          name="patientAddress"
          register={register}
          errors={errors.patientAddress}
        />
        <CustomAppInput
          label="Hospital Name"
          name="hospitalName"
          register={register}
          errors={errors.hospitalName}
        />
        <CustomAppInput
          label="Hospital ID"
          name="hospitalId"
          register={register}
          errors={errors.hospitalId}
        />
        <CustomAppInput
          label="Clinic Address"
          name="clinicAddress"
          register={register}
          errors={errors.clinicAddress}
        />
        {/* Additional fields for timestamp, etc. */}

        {/* Dynamic fields for allergies, medications, and diseases */}
        <div>
          <label className="font-semibold text-blue-600">Patient Allergies</label>
          {allergies.map((_, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                {...register(`patientAllergies.${index}`)}
                placeholder={`Allergy #${index + 1}`}
              />
              <Button type="button" onClick={() => handleRemoveAllergy(index)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddAllergy}>Add Allergy</Button>
        </div>

        <div>
          <label className="font-semibold text-blue-600">Patient Medications</label>
          {medications.map((_, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                {...register(`patientMedications.${index}`)}
                placeholder={`Medication #${index + 1}`}
              />
              <Button type="button" onClick={() => handleRemoveMedication(index)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddMedication}>Add Medication</Button>
        </div>

        <div>
          <label className="font-semibold text-blue-600">Patient Diseases</label>
          {diseases.map((_, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                {...register(`patientDiseases.${index}`)}
                placeholder={`Disease #${index + 1}`}
              />
              <Button type="button" onClick={() => handleRemoveDisease(index)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddDisease}>Add Disease</Button>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full mt-4 text-blue-500 hover:">Submit Appointment</Button>
      </form>
    </div>
  );
};

export default AppointmentForm;
